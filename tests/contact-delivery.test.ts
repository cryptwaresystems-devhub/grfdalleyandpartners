import test from 'node:test';
import assert from 'node:assert/strict';
import { serviceConfiguration, submitContact, recipient } from '../server/contact-service';
import { validateContact, type ContactRequest } from '../src/lib/contact-validation';
import { configuredBookingUrl } from '../src/lib/contact';
const env = { RESEND_API_KEY: 'fixture-secret-not-a-real-key', CONTACT_FROM_EMAIL: 'website@example.test', TURNSTILE_SECRET_KEY: 'fixture-turnstile-secret', TURNSTILE_SITE_KEY: 'fixture-public-site-key', CONTACT_ALLOWED_ORIGINS: 'https://firm.example.test' };
const origin = 'https://firm.example.test';
const draft: ContactRequest = { name: 'Test Person', email: 'visitor@example.test', phone: '', nature: 'General enquiry', message: 'Test fixture only', website: '', kind: 'enquiry', preference: '', token: 'fixture-token', requestId: '12345678-1234-4234-8234-123456789012' };
const json = (body: object, status = 200) => new Response(JSON.stringify(body), { status });
const verified = { success: true, hostname: 'firm.example.test', action: 'contact' };
test('missing settings fail closed without exposing server secrets', async () => {
  assert.equal(serviceConfiguration({}).deliveryConfigured, false);
  assert.equal((await submitContact(draft, origin, {})).status, 503);
  const config = serviceConfiguration(env);
  assert.equal(config.deliveryConfigured, true);
  assert.ok(!JSON.stringify(config).includes(env.RESEND_API_KEY));
  assert.ok(!JSON.stringify(config).includes(env.TURNSTILE_SECRET_KEY));
});
test('invalid origins, field types, validation and honeypots never invoke providers', async () => {
  const forbidden = async () => { throw new Error('Provider must not be called'); };
  assert.equal((await submitContact(draft, 'https://evil.test', env, forbidden)).status, 403);
  assert.equal((await submitContact({ ...draft, name: 42 }, origin, env, forbidden)).status, 400);
  assert.equal((await submitContact({ ...draft, email: 'bad' }, origin, env, forbidden)).status, 400);
  assert.equal((await submitContact({ ...draft, website: 'bot.test' }, origin, env, forbidden)).status, 400);
  assert.equal((await submitContact({ ...draft, token: '' }, origin, env, forbidden)).status, 400);
});
test('spam challenge must succeed for the same hostname and action', async () => {
  for (const challenge of [{ success: false }, { ...verified, hostname: 'evil.test' }, { ...verified, action: 'other' }]) {
    let calls = 0;
    const result = await submitContact(draft, origin, env, async () => { calls++; return json(challenge); });
    assert.equal(result.status, 400); assert.equal(calls, 1);
  }
});
test('delivery uses a fixed recipient, reply address and repeat-safe request key', async () => {
  let calls = 0;
  const result = await submitContact({ ...draft, to: 'attacker@example.test' }, origin, env, async (url, options) => {
    calls++;
    if (String(url).includes('siteverify')) return json(verified);
    const payload = JSON.parse(String(options?.body));
    assert.deepEqual(payload.to, [recipient]);
    assert.equal(payload.reply_to, draft.email);
    assert.equal((options?.headers as Record<string, string>)['Idempotency-Key'], `contact/${draft.requestId}`);
    return json({ id: 'fixture-provider-reference' });
  });
  assert.equal(calls, 2); assert.equal(result.status, 202);
  assert.deepEqual(result.body, { status: 'accepted', reference: 'fixture-provider-reference' });
});
test('provider failures and malformed responses never report success or leak upstream data', async () => {
  for (const failure of [json({ error: 'PRIVATE upstream detail' }, 500), json({})]) {
    const result = await submitContact(draft, origin, env, async url => String(url).includes('siteverify') ? json(verified) : failure);
    assert.equal(result.status, 502); assert.ok(!JSON.stringify(result).includes('PRIVATE'));
  }
  const result = await submitContact(draft, origin, env, async url => { if (String(url).includes('siteverify')) return json(verified); throw new Error('private network detail'); });
  assert.equal(result.status, 502); assert.ok(!JSON.stringify(result).includes('private network'));
});
test('consultation requests have the same security and do not confirm appointments', async () => {
  const result = await submitContact({ ...draft, kind: 'consultation', nature: 'Consultation request', preference: 'Video call, afternoon' }, origin, env, async (url, options) => {
    if (String(url).includes('siteverify')) return json(verified);
    assert.ok(JSON.parse(String(options?.body)).text.includes('does not confirm an appointment'));
    return json({ id: 'fixture-consultation' });
  });
  assert.equal(result.status, 202);
});
test('shared validation covers whitespace, email injection, length and optional phone', () => {
  assert.deepEqual(validateContact(draft), {});
  assert.ok(validateContact({ ...draft, name: '  ' }).name);
  assert.ok(validateContact({ ...draft, email: 'a@example.test\r\nBCC:evil@test.test' }).email);
  assert.ok(validateContact({ ...draft, phone: 'invalid' }).phone);
  assert.ok(validateContact({ ...draft, message: 'x'.repeat(1501) }).message);
  assert.ok(validateContact({ ...draft, preference: 'x'.repeat(201) }).preference);
});
test('calendar configuration rejects credentials, custom ports and lookalike hosts', () => {
  for (const url of ['https://user:password@calendly.com/demo', 'https://calendly.com:444/demo', 'http://calendly.com/demo', 'https://calendly.com.evil.test/demo']) assert.equal(configuredBookingUrl(url), null);
  assert.equal(serviceConfiguration({ CALENDLY_URL: 'https://calendly.com/fixture/consultation' }).bookingUrl, 'https://calendly.com/fixture/consultation');
});


test('Vercel HTTP adapter serves safe status and rejects unsupported, oversized or malformed requests', async () => {
  const { default: handler } = await import('../api/contact');
  type Request = Parameters<typeof handler>[0];
  type Response = Parameters<typeof handler>[1];
  async function request(method: string, body?: unknown, contentType = 'application/json') {
    let output = ''; let status = 0;
    const headers: Record<string, string> = {};
    const response = { setHeader: (name: string, value: string) => { headers[name] = value; }, set statusCode(value: number) { status = value; }, end: (value: string) => { output = value; } } as unknown as Response;
    await handler({ method, body, headers: { 'content-type': contentType } } as Request, response);
    return { status, body: JSON.parse(output), headers };
  }
  const status = await request('GET');
  assert.equal(status.status, 200); assert.equal(status.headers['Cache-Control'], 'no-store');
  assert.deepEqual(Object.keys(status.body).sort(), ['bookingUrl', 'deliveryConfigured', 'turnstileSiteKey']);
  assert.equal((await request('DELETE')).status, 405);
  assert.equal((await request('POST', {}, 'text/plain')).status, 415);
  assert.equal((await request('POST', { message: 'x'.repeat(17000) })).status, 413);
  assert.equal((await request('POST', '{bad json')).status, 400);
});


test('malformed request identifiers are rejected before any provider call', async () => {
  for (const requestId of ['-'.repeat(36), 'a'.repeat(36), '12345678-1234-1234-1234-123456789012']) {
    let calls = 0;
    const result = await submitContact({ ...draft, requestId }, origin, env, async () => { calls++; return json(verified); });
    assert.equal(result.status, 400); assert.equal(calls, 0);
  }
});

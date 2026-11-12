import { configuredBookingUrl } from '../src/lib/contact';
import { validateContact, type ContactRequest } from '../src/lib/contact-validation';
export type Environment = Record<string, string | undefined>;
export const recipient = 'inq@grfdalleyandpartners.com';
function origins(env: Environment) {
  return (env.CONTACT_ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(value => { try { return new URL(value).origin === value && /^https?:/.test(value); } catch { return false; } });
}
export function serviceConfiguration(env: Environment) {
  const deliveryConfigured = Boolean(env.RESEND_API_KEY && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.CONTACT_FROM_EMAIL ?? '') && env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY && origins(env).length);
  return { deliveryConfigured, turnstileSiteKey: deliveryConfigured ? env.TURNSTILE_SITE_KEY : null, bookingUrl: configuredBookingUrl(env.CALENDLY_URL ?? null) };
}
export async function submitContact(body: unknown, origin: string | undefined, env: Environment, fetcher: typeof fetch = fetch): Promise<{ status: number; body: object }> {
  const reply = (status: number, message: string) => ({ status, body: { message } });
  if (!serviceConfiguration(env).deliveryConfigured) return reply(503, 'Online delivery is pending configuration. Please use the email option.');
  if (!origin || !origins(env).includes(origin)) return reply(403, 'This request origin is not permitted.');
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Invalid request.');
  const input = body as Record<string, unknown>;
  for (const key of ['name', 'email', 'phone', 'nature', 'message', 'website', 'kind', 'preference', 'token', 'requestId']) if (typeof input[key] !== 'string') return reply(400, 'Invalid request fields.');
  const draft = input as unknown as ContactRequest;
  const errors = validateContact(draft);
  if (Object.keys(errors).length) return { status: 400, body: { message: 'Please check the highlighted fields.', errors } };
  if (draft.website || !/^[a-f0-9-]{36}$/i.test(draft.requestId) || !draft.token || draft.token.length > 2048) return reply(400, 'Please complete the spam check and try again.');
  try {
    const verification = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY!, response: draft.token }), signal: AbortSignal.timeout(8000) });
    const check = await verification.json() as { success?: boolean; hostname?: string; action?: string };
    if (!verification.ok || !check.success || check.hostname !== new URL(origin).hostname || check.action !== 'contact') return reply(400, 'Spam verification expired or failed. Please try again.');
  } catch { return reply(502, 'Spam verification is unavailable. Please retry or email the firm.'); }
  try {
    const response = await fetcher('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${draft.requestId}` }, body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [recipient], reply_to: draft.email, subject: `Website ${draft.kind}: ${draft.nature}`, text: [`Name: ${draft.name}`, `Email: ${draft.email}`, `Phone: ${draft.phone || 'Not supplied'}`, `Nature: ${draft.nature}`, `Preference: ${draft.preference || 'Not supplied'}`, '', draft.message, '', 'A consultation request does not confirm an appointment.'].join('\n') }), signal: AbortSignal.timeout(10000) });
    const result = await response.json() as { id?: string };
    if (!response.ok || !result.id) return reply(502, 'The delivery provider has not confirmed acceptance. Retry or use email.');
    return { status: 202, body: { status: 'accepted', reference: result.id } };
  } catch { return reply(502, 'We could not confirm acceptance. Retrying this unchanged request avoids a duplicate email. You can also contact the firm by email.'); }
}

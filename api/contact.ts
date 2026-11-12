import type { IncomingMessage, ServerResponse } from 'node:http';
import { serviceConfiguration, submitContact } from '../server/contact-service';
export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  const send = (status: number, body: object) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (req.method === 'GET') return send(200, serviceConfiguration(process.env));
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return send(405, { message: 'Method not allowed.' }); }
  if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { message: 'JSON is required.' });
  try {
    let body: unknown = req.body;
    if (body === undefined) {
      const chunks: Buffer[] = []; let size = 0;
      for await (const chunk of req) { const buffer = Buffer.from(chunk); size += buffer.length; if (size > 16384) return send(413, { message: 'Request is too large.' }); chunks.push(buffer); }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } else { if (Buffer.byteLength(JSON.stringify(body)) > 16384) return send(413, { message: 'Request is too large.' }); if (typeof body === 'string') body = JSON.parse(body); }
    const result = await submitContact(body, req.headers.origin, process.env);
    send(result.status, result.body);
  } catch { send(400, { message: 'Unable to read this request. Please try again.' }); }
}

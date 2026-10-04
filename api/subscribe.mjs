// Server-only: never expose KIT_API_KEY through a VITE_ environment variable.
export default async function subscribe(req, res) {
  const reply = (status, data) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(data));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(405, { error: 'Use POST to subscribe.' });
  }
  if (!req.headers['content-type']?.includes('application/json')) return reply(415, { error: 'Send JSON.' });
  if (req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) return reply(403, { error: 'Request not allowed.' });
    } catch { return reply(403, { error: 'Request not allowed.' }); }
  }
  let body;
  try {
    if (req.body !== undefined) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (Buffer.byteLength(JSON.stringify(body)) > 2048) return reply(413, { error: 'Request too large.' });
    } else {
      const chunks = [];
      let bytes = 0;
      for await (const chunk of req) {
        const buffer = Buffer.from(chunk);
        bytes += buffer.length;
        if (bytes > 2048) return reply(413, { error: 'Request too large.' });
        chunks.push(buffer);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }
  } catch { return reply(400, { error: 'Invalid request.' }); }
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, { error: 'Enter a valid email address.' });
  if (body.website) return reply(200, { success: true }); // Honeypot: ignore automated submissions.
  if (!process.env.KIT_API_KEY) return reply(503, { error: 'Signup is temporarily unavailable. Please try again later.' });
  try {
    const upstream = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': process.env.KIT_API_KEY },
      body: JSON.stringify({ email_address: email, state: 'active' }),
      signal: AbortSignal.timeout(10000),
    });
    if (upstream.ok) {
      const result = await upstream.json();
      // Kit's upsert does not reactivate previously unsubscribed addresses.
      if (result?.subscriber?.state !== 'active') {
        return reply(409, { error: 'This address couldn’t be subscribed. Contact support@gosendeet.com for help.' });
      }
      return reply(200, { success: true });
    }
    if (upstream.status === 422) return reply(400, { error: 'Please check your email address and try again.' });
    if (upstream.status === 429) {
      res.setHeader('Retry-After', '60');
      return reply(429, { error: 'Please wait a minute and try again.' });
    }
    return reply(502, { error: 'We couldn’t subscribe you right now. Please try again.' });
  } catch { return reply(502, { error: 'We couldn’t subscribe you right now. Please try again.' }); }
}

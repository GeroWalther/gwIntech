import { WIDGET_API_KEY, isOriginAllowed, issueToken } from '@/lib/assistant/server';

// Exchanges the widget's public API key for a short-lived signed token.
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  if (req.headers['x-api-key'] !== WIDGET_API_KEY) {
    return res.status(401).json({ status: 'error', message: 'Invalid API key' });
  }

  const origin = req.headers.origin;
  if (!isOriginAllowed(req, origin)) {
    return res
      .status(403)
      .json({ status: 'error', message: 'This domain is not authorized to use this API key' });
  }

  const { token, expiresIn } = issueToken(origin);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    status: 'success',
    data: { access_token: token, expires_in: expiresIn, token_type: 'Bearer' },
  });
}

import { WIDGET_CONFIG, verifyRequestToken } from '@/lib/assistant/server';

// Branding and copy for the chat bubble.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  if (!verifyRequestToken(req)) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Invalid or expired token. Please obtain a new token.' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ status: 'success', data: WIDGET_CONFIG });
}

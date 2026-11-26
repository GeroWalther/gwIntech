import {
  answerQuestion,
  clientIp,
  isRateLimited,
  verifyRequestToken,
} from '@/lib/assistant/server';

export const config = { maxDuration: 60 };

// Answers one visitor question from the knowledge base.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  if (!verifyRequestToken(req)) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Invalid or expired token. Please obtain a new token.' });
  }

  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question) {
    return res.status(400).json({ status: 'error', message: 'Question is required' });
  }

  if (isRateLimited(clientIp(req))) {
    return res
      .status(429)
      .json({ status: 'error', message: 'Too many questions. Please try again in a few minutes.' });
  }

  try {
    const response = await answerQuestion(question);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ status: 'success', data: response });
  } catch (error) {
    console.error('assistant ask failed:', error.message);
    return res
      .status(500)
      .json({ status: 'error', message: 'An error occurred while processing your request' });
  }
}

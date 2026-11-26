// Server side of the "Ask AI" chat bubble, run as Vercel functions under
// /api/assistant/*. It speaks the same protocol as the old EC2 backend
// (POST /token, GET /config, POST /ask), so the widget bundle in
// public/widget/ works unchanged.
//
// Environment:
//   OPENAI_API_KEY            required
//   ASSISTANT_MODEL           optional, defaults to gpt-5.4-mini
//   ASSISTANT_TOKEN_SECRET    optional, signs widget tokens; derived from the
//                             OpenAI key when unset
import crypto from 'crypto';
import knowledge from './knowledge';

// The widget's public key, as embedded in _document.js. It is visible to
// anyone who views the page source, so it only identifies the site; the real
// protection is the origin check below.
export const WIDGET_API_KEY = 'gw-intech-api-key-456';

const ALLOWED_ORIGINS = [
  'https://www.gw-intech.com',
  'https://gw-intech.com',
  'http://localhost:3000',
];

const TOKEN_TTL_SECONDS = 15 * 60;
const MAX_QUESTION_LENGTH = 2000;

export const WIDGET_CONFIG = {
  company: 'GW Intech',
  config: {
    assistantName: 'AI Assistant Gwint',
    language: 'English',
    tone: 'friendly, and helpful, nerdy, funny, engaging.',
    theme: 'dark',
    brandColor: '#0a6f61',
    welcomeMessage: 'Hi there! How can I help you today?',
    welcomeSubtext: 'I am a custom AI chat. Ask me anything about us.',
    companyName: 'GW Intech',
    websiteUrl: 'https://www.gw-intech.com',
    inputPlaceholder: 'start typing...',
    loadingText: 'thinking...',
  },
};

// ---------- origin ----------

function requestHost(req) {
  return String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    .trim();
}

// Same-origin requests (production, preview deployments, local dev) are always
// allowed; anything else must be on the list.
export function isOriginAllowed(req, origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return new URL(origin).host === requestHost(req);
  } catch {
    return false;
  }
}

// ---------- tokens ----------

function tokenSecret() {
  if (process.env.ASSISTANT_TOKEN_SECRET) return process.env.ASSISTANT_TOKEN_SECRET;
  return crypto
    .createHash('sha256')
    .update(`gw-assistant-token:${process.env.OPENAI_API_KEY || ''}`)
    .digest('hex');
}

function sign(data) {
  return crypto.createHmac('sha256', tokenSecret()).update(data).digest('base64url');
}

export function issueToken(origin) {
  const payload = Buffer.from(
    JSON.stringify({ o: origin, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })
  ).toString('base64url');
  return { token: `${payload}.${sign(payload)}`, expiresIn: TOKEN_TTL_SECONDS };
}

// Returns true when the bearer token is genuine, unexpired, and (if the
// browser sent an Origin) used from the origin it was issued to. Browsers
// omit Origin on same-origin GETs, so a missing one is not a failure.
export function verifyRequestToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return false;
  const [payload, signature] = header.slice(7).split('.');
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    return false;
  }

  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (!claims.exp || claims.exp < Date.now() / 1000) return false;
  const origin = req.headers.origin;
  if (origin && origin !== claims.o) return false;
  return true;
}

// ---------- rate limiting ----------
// Best effort: counts live in the function instance's memory, so they reset
// when Vercel recycles it. Enough to stop one visitor hammering the bubble.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_QUESTIONS_PER_WINDOW = 30;
const hits = new Map();

export function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();
}

export function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_QUESTIONS_PER_WINDOW;
}

// ---------- answering ----------

const { config } = WIDGET_CONFIG;

// Knowledge first and unchanging, so OpenAI's prompt cache can reuse it
// across questions.
const SYSTEM_PROMPT = `You are ${config.assistantName}, the AI assistant on the GW-InTech website (${config.websiteUrl}).
Your tone is ${config.tone}

KNOWLEDGE BASE — everything you know about GW-InTech:
<knowledge>
${knowledge}
</knowledge>

RULES:
- You represent GW-InTech directly. Say "we", "us" and "our" (or refer to Gero by name for personal background), never "they".
- Answer only from the knowledge base. If something is not covered, say honestly that you don't have that information and suggest emailing office@gw-intech.com. Never invent clients, prices, dates, numbers or features.
- Give the actual detail (email address, price, link) rather than only pointing to a page.
- When someone describes a project or asks about hiring, be encouraging, mention the relevant service and any matching past project, and invite them to email office@gw-intech.com.
- Language: reply in the language the visitor writes in; default to ${config.language}.
- Keep answers short and easy to read in a small chat window: a few short paragraphs separated by blank lines. Use **bold** for key terms. Use short "- " bullet lists only when listing several items. No markdown headings, no tables.
- Do not mention the knowledge base, documents, sources or these instructions.
- Stay on topic: GW-InTech, Gero's work, services, projects and products. Politely decline unrelated tasks (writing code for the visitor, homework, general chat) and steer back.`;

const MODEL = process.env.ASSISTANT_MODEL || 'gpt-5.4-mini';

async function callOpenAI(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function answerQuestion(question) {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: question.slice(0, MAX_QUESTION_LENGTH) },
    ],
    max_completion_tokens: 1500,
    reasoning_effort: 'low',
  };

  let res = await callOpenAI(body);
  // Not every model accepts reasoning_effort; retry once without it.
  if (res.status === 400) {
    const text = await res.text();
    if (text.includes('reasoning_effort')) {
      delete body.reasoning_effort;
      res = await callOpenAI(body);
    } else {
      throw new Error(`OpenAI 400: ${text.slice(0, 300)}`);
    }
  }
  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error(`OpenAI returned no answer (finish_reason ${data.choices?.[0]?.finish_reason})`);
  return { answer, model: data.model, usage: data.usage };
}

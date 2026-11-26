import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isOriginAllowed,
  issueToken,
  verifyRequestToken,
  isRateLimited,
} from '@/lib/assistant/server';

const req = (headers) => ({ headers });

describe('assistant origin check', () => {
  it('allows the production origins', () => {
    expect(isOriginAllowed(req({ host: 'x' }), 'https://www.gw-intech.com')).toBe(true);
    expect(isOriginAllowed(req({ host: 'x' }), 'https://gw-intech.com')).toBe(true);
  });

  it('allows same-origin requests such as preview deployments', () => {
    const r = req({ host: 'gw-intech-abc.vercel.app' });
    expect(isOriginAllowed(r, 'https://gw-intech-abc.vercel.app')).toBe(true);
  });

  it('rejects other and missing origins', () => {
    const r = req({ host: 'www.gw-intech.com' });
    expect(isOriginAllowed(r, 'https://evil.example')).toBe(false);
    expect(isOriginAllowed(r, undefined)).toBe(false);
  });
});

describe('assistant tokens', () => {
  afterEach(() => vi.useRealTimers());

  const bearer = (token, origin) =>
    req({ authorization: `Bearer ${token}`, ...(origin ? { origin } : {}) });

  it('accepts a fresh token from its own origin, or with no origin', () => {
    const { token } = issueToken('https://www.gw-intech.com');
    expect(verifyRequestToken(bearer(token, 'https://www.gw-intech.com'))).toBe(true);
    expect(verifyRequestToken(bearer(token))).toBe(true);
  });

  it('rejects a token used from another origin', () => {
    const { token } = issueToken('https://www.gw-intech.com');
    expect(verifyRequestToken(bearer(token, 'https://evil.example'))).toBe(false);
  });

  it('rejects tampered, malformed and missing tokens', () => {
    const { token } = issueToken('https://www.gw-intech.com');
    const [payload, sig] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ o: 'https://evil.example', exp: 9999999999 })
    ).toString('base64url');
    expect(verifyRequestToken(bearer(`${forged}.${sig}`))).toBe(false);
    expect(verifyRequestToken(bearer(`${payload}.x${sig}`))).toBe(false);
    expect(verifyRequestToken(bearer('garbage'))).toBe(false);
    expect(verifyRequestToken(req({}))).toBe(false);
  });

  it('rejects an expired token', () => {
    vi.useFakeTimers();
    const { token, expiresIn } = issueToken('https://www.gw-intech.com');
    vi.setSystemTime(Date.now() + (expiresIn + 1) * 1000);
    expect(verifyRequestToken(bearer(token))).toBe(false);
  });
});

describe('assistant rate limit', () => {
  it('blocks an IP after 30 questions in the window', () => {
    const ip = `test-${Math.random()}`;
    for (let i = 0; i < 30; i++) expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(true);
    expect(isRateLimited(`${ip}-other`)).toBe(false);
  });
});

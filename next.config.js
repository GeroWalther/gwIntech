// The "Ask AI" chat bubble is BlueberryChat AI, our hosted assistant product.
// Its widget and API both live on the Blueberry site; set this to a local
// Blueberry dev server (e.g. http://localhost:3100) to test against that.
const ASSISTANT_ORIGIN =
  process.env.NEXT_PUBLIC_ASSISTANT_ORIGIN || 'https://www.gotoblueberryai.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The product was renamed from AI Studio to AI Box. Anything already linking
  // or indexed against the old path keeps working, and search engines move the
  // ranking across rather than seeing two pages for one product.
  async redirects() {
    return [
      { source: '/ai-studio', destination: '/ai-box', permanent: true },
    ];
  },

  // The game (Pip & the Star Lantern) is a static PWA in public/game, built from the
  // dungeon-monsters repo with web/deploy-gwintech.sh. /game serves its page.
  async rewrites() {
    return [{ source: '/game', destination: '/game/index.html' }];
  },

  // Security headers configuration
  async headers() {
    return [
      {
        // Serve WASM files with correct MIME type
        source: '/game/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
        ],
      },
      {
        // The game's service worker lives in /game/ but controls the page at /game.
        source: '/game/sw.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/game' },
          { key: 'Cache-Control', value: 'no-cache' },
        ],
      },
      {
        // Always revalidate the page so a new build is picked up straight away.
        source: '/game',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Prevents clickjacking while allowing same-origin frames
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents MIME type sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Legacy XSS protection (CSP is better)
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Secure referrer policy
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'", // Only allow resources from same origin by default
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://va.vercel-scripts.com https://cdn.jsdelivr.net ${ASSISTANT_ORIGIN}`, // Allow inline scripts, WASM, CDN and the chat widget
              `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net ${ASSISTANT_ORIGIN}`, // Allow inline styles, CDN and the chat widget
              "img-src 'self' data: https:", // Allow images from self, data URLs, and HTTPS
              "font-src 'self' https:", // Allow fonts from self and HTTPS
              `connect-src 'self' https: ws: wss: ${ASSISTANT_ORIGIN}`, // Allow API calls to self, HTTPS, WebSocket connections and the chat API
              "frame-ancestors 'self'", // Equivalent to X-Frame-Options
              "base-uri 'self'", // Prevent base tag injection
              "form-action 'self'", // Only allow form submissions to same origin
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()', // Disable camera access
              'microphone=()', // Disable microphone access
              'geolocation=()', // Disable geolocation access
              'interest-cohort=()', // Disable FLoC tracking
            ].join(', '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

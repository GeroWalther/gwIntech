/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers configuration
  async headers() {
    return [
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts (adjust as needed)
              "style-src 'self' 'unsafe-inline'", // Allow inline styles
              "img-src 'self' data: https:", // Allow images from self, data URLs, and HTTPS
              "font-src 'self' https:", // Allow fonts from self and HTTPS
              "connect-src 'self' https:", // Allow API calls to self and HTTPS
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

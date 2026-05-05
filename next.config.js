/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.141.224.253'],
}
module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.141.224.253'],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY' },
        { key: 'X-Content-Type-Options',     value: 'nosniff' },
        { key: 'X-XSS-Protection',           value: '1; mode=block' },
        { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',         value: 'geolocation=(), microphone=(), camera=()' },
      ],
    },
  ],
}
module.exports = nextConfig
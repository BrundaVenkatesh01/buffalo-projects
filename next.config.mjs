import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const CONTENT_SECURITY_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com https://app.posthog.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://lh3.googleusercontent.com https://firebasestorage.googleapis.com https://images.unsplash.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://app.posthog.com https://api.resend.com https://*.upstash.io https://www.google-analytics.com https://www.googletagmanager.com;
  frame-src 'self' https://www.youtube.com https://player.vimeo.com;
  media-src 'self' blob:;
  object-src 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: CONTENT_SECURITY_POLICY,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      // Keep to widely supported features to avoid console warnings
      "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: Turbopack is the default in Next.js 16, but production builds use Webpack
  output: "standalone",
  // Use cacheMaxMemorySize instead of deprecated isrMemoryCacheSize (removed in Next.js 14.1+)
  cacheMaxMemorySize: 0,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

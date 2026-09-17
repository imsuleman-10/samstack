import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: ['pdf-lib', '@pdf-lib/fontkit', 'nodemailer', 'firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "uxammubevejojnfvjpwe.supabase.co",
      },
    ],
  },
  allowedDevOrigins: ['192.168.100.10'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

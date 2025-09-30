import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aai56obygqzta7cs.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;

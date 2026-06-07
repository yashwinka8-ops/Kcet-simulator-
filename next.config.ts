import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
});

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  turbopack: {}
};

export default withPWA(nextConfig);

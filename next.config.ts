import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/music-flow",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

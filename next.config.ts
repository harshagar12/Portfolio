import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  trailingSlash: true,
  images: {
    unoptimized: true
  }
  /* config options here */
};
module.exports = nextConfig

export default nextConfig;
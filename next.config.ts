import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The offer route reads the two Word templates off disk. Nothing imports
  // them, so tracing cannot see them and they would be left out of the
  // deployed function bundle. They sit outside `public/` on purpose — served
  // from there, the whole price list was downloadable without signing in.
  outputFileTracingIncludes: {
    "/api/offers/generate": ["./offer-templates/**"]
  }
};

export default nextConfig;

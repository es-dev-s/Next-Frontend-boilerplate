import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake lucide icons — critical when many modules import from the package
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

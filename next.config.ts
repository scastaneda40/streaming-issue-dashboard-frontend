import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@apollo/client"],
  },
  transpilePackages: [
    "@chakra-ui/react",
    "@chakra-ui/alert",
    "@chakra-ui/form-control",
  ],
  turbopack: {},
};

export default nextConfig;

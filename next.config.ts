import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@chakra-ui/react",
    "@chakra-ui/alert",
    "@chakra-ui/form-control",
  ],
};

export default nextConfig;

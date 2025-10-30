const path = require("path");

const nextConfig = {
  transpilePackages: [
    "@chakra-ui/react",
    "@chakra-ui/alert",
    "@chakra-ui/form-control",
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@apollo/client/react/hooks": path.resolve(
        __dirname,
        "node_modules/@apollo/client/react/hooks/useQuery.js" // This path might need adjustment
      ),
    };
    return config;
  },
};

module.exports = nextConfig;

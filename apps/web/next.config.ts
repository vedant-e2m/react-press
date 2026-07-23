import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@nextpress/shared",
    "@nextpress/cms-core",
    "@nextpress/cms-strapi",
    "@nextpress/strapi-client",
    "@nextpress/builder",
  ],
};

export default nextConfig;

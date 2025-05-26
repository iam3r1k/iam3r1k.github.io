import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    images: {
        remotePatterns: [new URL('https://tr.rbxcdn.com/**')],
    },
}

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
    instrumentationHook: true,
  }
};

module.exports = nextConfig;


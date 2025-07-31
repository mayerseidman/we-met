/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.next/**', '**/prisma/**'],
      };
    }
    return config;
  }
}

module.exports = nextConfig

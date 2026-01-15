const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: '/we-met',  // ADD THIS LINE
    assetPrefix: '/we-met',  // ADD THIS LINE TOO
}
module.exports = nextConfig
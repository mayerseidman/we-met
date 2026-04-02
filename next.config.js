const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/we-met' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/we-met' : '',
}
module.exports = nextConfig
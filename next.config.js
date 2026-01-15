const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',  // ADD THIS - tells Next.js to generate static files
    images: {
        unoptimized: true,  // ADD THIS - GitHub Pages doesn't support Next.js image optimization
    },
}
module.exports = nextConfig
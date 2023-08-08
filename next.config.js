/** @type {import('next').NextConfig} */
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Replace with your API endpoint
      },
    ];
  },
  assetPrefix: './', // Add this line
};

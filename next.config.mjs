/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Config options here */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.careermitra.in',
          },
        ],
        destination: 'https://careermitra.in/:path*',
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;

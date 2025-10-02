/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'server'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

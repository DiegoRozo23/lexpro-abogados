/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/lexpro-abogados',
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig

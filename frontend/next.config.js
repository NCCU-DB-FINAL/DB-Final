/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "http://127.0.0.1:5000/api",
  }
}

module.exports = nextConfig

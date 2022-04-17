// @ts-nocheck

/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["jbb-admin.herokuapp.com", "res.cloudinary.com"],
  },
  env: {
    publicUrl: "http://localhost:3000",
  },
  // experimental: {
  //   concurrentFeatures: true,
  //   serverComponents: true,
  // },
};

module.exports = nextConfig;

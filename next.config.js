// @ts-nocheck

/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  swcMinify: true,
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.(png|jpe?g|gif)$/i,
  //     use: [
  //       {
  //         loader: "file-loader",
  //       },
  //     ],
  //   });

  //   return config;
  // },
};

module.exports = nextConfig;

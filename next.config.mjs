/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        CLOUDINARY_URL: process.env.CLOUDINARY_URL,
      },
  };
  
  export default nextConfig;
  
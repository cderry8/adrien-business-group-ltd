/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'res.cloudinary.com', 
    ],
  },
};

export default nextConfig;

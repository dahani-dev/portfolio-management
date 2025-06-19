import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js configuration options

  // Enables loading external images using the <Image /> component
  // Here, we allow loading images from http://localhost:3000/uploads/*
  images: {
    remotePatterns: [
      {
        protocol: "http", // Protocol of the external URL (http or https)
        hostname: "localhost", // Hostname where the images are served from
        port: "3000", // Port number of the backend server
        pathname: "/uploads/**", // URL path pattern: allows all files under /uploads/
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname:"lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname:"encrypted-tbn0.gstatic.com"
      },
      {
        protocol: "https",
        hostname:"**"
      },
      {
        protocol: "http",
        hostname:"**"
      },
    ]
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1', '192.168.100.1', '169.254.255.189', 'localhost'],
  /* config options here */
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'image.mux.com'
            }
        ]
    }
};

export default nextConfig;

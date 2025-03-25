import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'image.mux.com'
            }, {
                hostname: 'ehte6qykyd.ufs.sh'
            }
        ]
    }
};

export default nextConfig;

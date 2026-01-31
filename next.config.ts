import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: ['@douyinfe/semi-ui-19', '@douyinfe/semi-icons'],
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://code.xueersi.com/api/:path*',
            },
            {
                source: '/removed/api/:path*',
                destination: 'https://chenify.pythonanywhere.com/api/:path*',
            }
        ];
    },
};

export default nextConfig;

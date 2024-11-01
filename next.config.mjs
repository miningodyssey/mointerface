/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false,
            // Добавьте другие модули, если нужно
        };
        return config;
    },
};

export default nextConfig;

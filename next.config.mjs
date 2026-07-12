/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Hero photography swap path: drop a licensed Unsplash interior/flat-lay in
    // /public/images/hero.jpg, OR point Hero's <Image> at a remote Unsplash URL.
    // remotePatterns is pre-authorised so the second option needs no further config.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;

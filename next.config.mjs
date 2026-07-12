/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Every visual on the site is HTML/CSS/SVG — no raster photography, no
    // stock, no remote hosts. AVIF/WebP kept for any future first-party asset.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

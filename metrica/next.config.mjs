/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product images are served from Supabase Storage via signed URLs.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  experimental: {
    // React-PDF uses Node internals; keep it external to the RSC/route bundle.
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    // Ensure the self-hosted Satoshi TTFs are traced into the PDF route on Vercel.
    outputFileTracingIncludes: {
      "/api/spec-book": ["./src/lib/pdf/fonts/**"],
    },
  },
};

export default nextConfig;

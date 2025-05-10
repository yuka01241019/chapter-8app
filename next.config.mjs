/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["arbgzvvwhnfhnrddujsm.supabase.co"], //Supabaseのドメイン追加
    remotePatterns: [
      { protocol: "https", hostname: "arbgzvvwhnfhnrddujsm.supabase.co" }, //Supabaseのドメイン追加
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
    ],
  },
};

export default nextConfig;

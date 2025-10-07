/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  exportPathMap: async () => ({
    "/": { page: "/" },
    "/results": { page: "/results" },
  }),
};

export default nextConfig;

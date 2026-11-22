import type { NextConfig } from "next";

// Server build: accounts and saved cards need a Node process. The card a helper
// scans is still packed into the link after #, which the browser does not send.
const nextConfig: NextConfig = { turbopack: { root: __dirname } };

export default nextConfig;

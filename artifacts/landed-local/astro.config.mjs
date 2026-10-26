import { defineConfig } from "astro/config";

// Static output to ./dist. Tailwind v3 runs through postcss.config.cjs.
export default defineConfig({
  site: "https://www.landedlocal.com",
  output: "static",
  outDir: "./dist",
  server: { host: "0.0.0.0", port: Number(process.env.PORT) || 4321 },
  vite: { server: { allowedHosts: true }, preview: { allowedHosts: true } },
});

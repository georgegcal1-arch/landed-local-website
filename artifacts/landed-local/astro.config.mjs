import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { copyFile } from "node:fs/promises";

const indexablePaths = new Set(["/", "/websites", "/about", "/get-a-mockup", "/privacy"]);

// Static output to ./dist. Tailwind v3 runs through postcss.config.cjs.
export default defineConfig({
  site: "https://www.landedlocal.com",
  integrations: [sitemap({
    filter: (page) => indexablePaths.has(new URL(page).pathname.replace(/\/$/, "") || "/"),
    serialize: (item) => ({
      ...item,
      url: new URL(item.url).pathname === "/" ? item.url : item.url.replace(/\/$/, ""),
    }),
  }), {
    name: "sitemap-xml-alias",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        // Keep the requested standalone URL alongside the integration's index.
        await copyFile(new URL("sitemap-0.xml", dir), new URL("sitemap.xml", dir));
      },
    },
  }],
  output: "static",
  outDir: "./dist",
  server: { host: "0.0.0.0", port: Number(process.env.PORT) || 4321 },
  vite: { server: { allowedHosts: true }, preview: { allowedHosts: true } },
});

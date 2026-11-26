// Rebuild the share card with the existing logo, fonts and design tokens.
// Uses Astro's installed image processor; no photo or generated artwork.
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.resolve("astro"));
const sharp = require("sharp");
const root = new URL("../", import.meta.url);
const tokens = await readFile(new URL("src/styles/tokens.css", root), "utf8");
const color = (name) => {
  const value = tokens.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Missing color token: ${name}`);
  return value.trim();
};
const text = async (copy, family, weight, size, ink) => sharp({
  text: {
    text: `<span foreground="${color(ink)}">${copy}</span>`,
    font: `${family} ${weight === 800 ? "ExtraBold" : "Regular"} ${size}`,
    fontfile: fileURLToPath(new URL(`../node_modules/@fontsource/${family.toLowerCase()}/files/${family.toLowerCase()}-latin-${weight}-normal.woff2`, import.meta.url)),
    rgba: true,
  },
}).png().toBuffer();
const ruler = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 629H1200" stroke="${color("orange")}" stroke-width="2"/>
  ${Array.from({ length: 61 }, (_, i) => `<path d="M${i * 20} 630v-${i % 5 === 0 ? 24 : 12}" stroke="${color("orange")}" stroke-width="2"/>`).join("")}
  <path d="M80 200v260h1040" fill="none" stroke="${color("orange")}" stroke-width="8"/>
</svg>`;
await sharp({ create: { width: 1200, height: 630, channels: 4, background: color("offwhite") } })
  .composite([
    { input: await sharp(new URL("public/brand/website-header-logo.svg", root).pathname).resize({ width: 360 }).png().toBuffer(), left: 80, top: 70 },
    { input: Buffer.from(ruler), left: 0, top: 0 },
    { input: await text("Land more local jobs.", "Manrope", 800, 64, "charcoal"), left: 112, top: 250 },
    { input: await text("AI systems for local service businesses", "Inter", 400, 30, "teal"), left: 112, top: 365 },
  ])
  .png()
  .toFile(new URL("public/og-image.png", root).pathname);

/** Every value maps to a CSS custom property in src/styles/tokens.css. */
const v = (name) => `var(--${name})`;
const step = (n) => `calc(var(--space) * ${n})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,ts,md,mdx}"],
  // Keep core token utilities available while pages are deliberately h1-only.
  safelist: ["bg-orange", "bg-paper", "text-teal"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      orange: { DEFAULT: v("color-orange"), burnt: v("color-orange-burnt"), tint: v("color-orange-tint") },
      charcoal: v("color-charcoal"),
      teal: { DEFAULT: v("color-teal"), light: v("color-teal-light"), tint: v("color-teal-tint") },
      offwhite: v("color-offwhite"),
      paper: v("color-paper"),
      steel: v("color-steel"),
      rule: v("color-rule"),
      white: v("color-white"),
    },
    fontFamily: { display: v("font-display"), body: v("font-body") },
    fontSize: {
      h1: [v("text-h1"), { lineHeight: v("leading-h1"), letterSpacing: v("tracking-h1") }],
      h2: [v("text-h2"), { lineHeight: v("leading-h2") }],
      h3: v("text-h3"),
      body: [v("text-body"), { lineHeight: v("leading-body") }],
      small: v("text-small"),
    },
    borderRadius: { none: "0", sharp: v("radius-sharp"), corner: v("radius-corner"), input: v("radius-input") },
    boxShadow: { none: "none", card: v("shadow-card") },
    maxWidth: { content: v("content-max"), prose: v("prose-max"), none: "none", full: "100%" },
    spacing: {
      0: "0", px: "1px",
      1: step(1), 2: step(2), 3: step(3), 4: step(4), 5: step(5), 6: step(6),
      8: step(8), 10: step(10), 12: step(12), 16: step(16),
      gutter: v("gutter"), section: v("section-y"),
    },
  },
  plugins: [
    ({ addUtilities }) =>
      addUtilities({
        // Signature shape: 12px bottom-left, 2px on the other three corners.
        ".rounded-signature": {
          "border-radius": "var(--radius-sharp) var(--radius-sharp) var(--radius-sharp) var(--radius-corner)",
        },
      }),
  ],
};

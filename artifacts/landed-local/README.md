# Landed Local website

Static Astro site for Landed Local, George's Columbus web studio for local trades.

## Setup and commands
Run `pnpm install` at the repo root, then:
- `pnpm --filter @workspace/landed-local run dev` - dev server (binds 0.0.0.0, uses $PORT)
- `pnpm --filter @workspace/landed-local run build` - static build to `dist/`
- `pnpm --filter @workspace/landed-local run serve` - preview the build
- `pnpm --filter @workspace/landed-local run typecheck` - astro check

## Key files
- `src/config/site.ts` - business facts, prices, contact info, flags, domain and brand file paths. Every field is commented.
- `src/styles/tokens.css` - colors, radii, shadow, spacing, type sizes. Change a token and it changes everywhere.
- `tailwind.config.cjs` - maps tokens to classes (`bg-paper`, `text-teal`, `rounded-signature`, `shadow-card`, `max-w-content`).
- `src/styles/global.css` - fonts (Fontsource) and global typography.
- `src/layouts/BaseLayout.astro` - shared head (meta, canonical, Open Graph, favicons, theme-color), skip link, main.
- `src/pages/` - /, /websites, /about, /get-a-mockup, /thanks, /privacy, 404.
- `public/brand/` - the 11 logo, icon and photo files, original names.

## Editing site.ts
Change only the values after the colons. Keep quotes around text; leave numbers and true/false unquoted; use `null` for "not set yet". Examples: `foundingSpotsLeft: 2` after a spot is taken, `showSpotsLeft: true` to display the count, `mode: "photo"` to switch the hero. Save and the dev server reloads.

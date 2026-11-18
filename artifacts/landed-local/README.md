# Landed Local website

Static Astro foundation for Landed Local, an AI agency for home-service businesses.

## Setup and commands
Run `pnpm install` at the repo root, then:
- `pnpm --filter @workspace/landed-local run dev` - dev server (binds 0.0.0.0, uses $PORT)
- `pnpm --filter @workspace/landed-local run build` - static build to `dist/`
- `pnpm --filter @workspace/landed-local run serve` - preview the build
- `pnpm --filter @workspace/landed-local run typecheck` - astro check

## Key files
- `src/config/site.ts` - business facts, contact info, booking copy, audience, tool compatibility, optional results, domain and brand file paths. Every field is commented.
- `src/styles/tokens.css` - colors, radii, shadow, spacing, type sizes. Change a token and it changes everywhere.
- `tailwind.config.cjs` - maps tokens to classes (`bg-paper`, `text-teal`, `rounded-signature`, `shadow-card`, `max-w-content`).
- `src/styles/global.css` - fonts (Fontsource) and global typography.
- `src/layouts/BaseLayout.astro` - shared head (meta, canonical, Open Graph, favicons, theme-color), skip link, main.
- `src/pages/` - placeholder Home, /book and /privacy pages, the internal /styleguide and custom 404.
- `public/brand/` - all existing logo, icon and profile tile files, including original names and aliases.

## Editing site.ts
Keep quotes around text and leave true/false unquoted. Use `null` for an unset photo or analytics token. Booking wording is shared with the temporary shell buttons so they stay in sync. The proof, demo and promise switches remain off until approved. Save and the dev server reloads.

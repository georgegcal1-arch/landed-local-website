# Landed Local

Static, phone-first marketing website for Landed Local, a Columbus web studio serving local service businesses.

## Run & Operate

- `pnpm --filter @workspace/landed-local run dev` — Astro development server (run via the managed workflow)
- `pnpm --filter @workspace/landed-local run build` — generate the static site in `artifacts/landed-local/dist`
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The marketing website requires no database or backend server.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: Astro static HTML, Tailwind CSS, self-hosted Fontsource Manrope and Inter, Lucide icons
- Pre-existing API/database libraries and canvas are not used by this website.

## Where things live

- Website: `artifacts/landed-local/`
- Business configuration: `artifacts/landed-local/src/config/site.ts`
- Design tokens: `artifacts/landed-local/src/styles/tokens.css`
- Original brand assets: `artifacts/landed-local/public/brand/`

## Architecture decisions

- The user explicitly requires Astro static output to `dist`, not React, a backend, or a database.
- Future lead submission is browser-to-Web3Forms; no submission form is included in the foundation step.
- Do not use SPA catch-all rewrites: this site has real generated HTML routes and a custom 404.

## Product

- Landed Local builds fast, phone-first websites for trades. The primary CTA in future steps is "Get my free mockup".

## User preferences

- Build one requested step at a time. Foundation pages contain only an h1; do not add full page sections until requested.
- For each style-guide fix round, change only explicitly listed components and keep everything else exactly the same.
- Preserve all 11 uploaded brand files with their original names.
- Every component color, font size, and spacing value must come from tokens.
- No gradients, glows, glassmorphism, robots, monospace code styling, or parallax.

## Gotchas

- Static hosting must serve the generated 404 page for missing routes, not rewrite them to the homepage.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

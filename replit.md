# Landed Local website

## What this project is
Static Astro site for Landed Local LLC (landedlocal.com), based in Columbus, Ohio. Landed Local finds where home-service companies (starting with roofing and HVAC) lose jobs and time, then builds the AI system that fixes it: AI receptionist, speed-to-lead and lead reactivation, workflow automation, CRM buildout, or custom AI tools.
The site has one goal: get owners to book a free 30-minute call, the "Missed-Jobs Review".

## Current phase (November 2026)
Simplifying the old website-offer site into a short, focused agency site, one step per request.

## Rules for every change
- Keep it simple: three pages (/, /book, /privacy), a 404, and one hidden page (/before-our-call: noindex, not in the nav or sitemap, linked only from the booking confirmation). Don't add pages, sections or features unless I ask.
- Static output only (Replit Static Deployment): no server, no database, no API routes.
- /styleguide is the design source of truth (noindex, not in the sitemap). Pages use only components shown there; a new component goes on /styleguide first.
- Colors, type sizes and spacing come only from src/styles/tokens.css. No hex values or one-off sizes in components or pages.
- Brand: orange is for buttons; teal is for checks and results; text on orange buttons is charcoal; Manrope 800 headlines, Inter body; cards and buttons have one rounded corner (bottom-left).
- Each signature piece has one job: work-order tickets = something they get or a step we commit to; ruler = order and measurement; pencil mark = the one key phrase (hero and book headlines only); teal check = done or a result.
- Business details, the niche line, booking settings and on/off switches live in src/config/site.ts. Pages read them from there.
- First name "George" only, in copy and metadata.
- No prices, no demo phone number (unless demo.showDemo is true), no stock photos, no AI-generated images.
- Every animation runs once and is off when prefers-reduced-motion is set.
- Mobile first: check every page at 390px wide. PageSpeed 90+ on mobile.
- No gradients, glows, glassmorphism, robots, monospace code styling or parallax.
- In a styleguide fix round, change only the components I list; everything else stays exactly the same.
- Keep all 11 brand files in /public/brand with their original names.

## How I like to work
- One step per request. If something outside the step needs changing, ask me first.
- Explain things in plain language; I'm not a developer.
- When you finish, list the files you changed and what I should check in the Preview.

## Technical notes

Static, phone-first marketing site for Landed Local, an AI agency for home-service businesses. One goal: book the free Missed-Jobs Review call.

### Run & operate
- `pnpm --filter @workspace/landed-local run dev` — Astro dev server (run via the managed workflow)
- `pnpm --filter @workspace/landed-local run build` — static site to `artifacts/landed-local/dist`
- `pnpm run typecheck` — typecheck all packages
- `pnpm run build` — typecheck + build all packages
- Not used by this website (template leftovers, don't run or edit): `pnpm --filter @workspace/api-spec run codegen`, `pnpm --filter @workspace/db run push`, the API/database libraries and canvas.

### Stack
- pnpm workspaces, Node.js 24, TypeScript 5.9
- Astro static HTML, Tailwind CSS mapped to tokens, self-hosted Fontsource Manrope and Inter, Lucide icons
- Booking: Cal.com inline embed (free plan), loaded only on pages that use the BookingEmbed. No forms, no Web3Forms.

### Where things live
- Website: `artifacts/landed-local/`
- Settings and on/off switches: `artifacts/landed-local/src/config/site.ts`
- Design tokens: `artifacts/landed-local/src/styles/tokens.css`
- Design source of truth: the /styleguide page (noindex, not in the sitemap)
- Brand assets: `artifacts/landed-local/public/brand/` (keep all 11 files with their original names)
- Hidden page: /before-our-call (noindex, not in the sitemap or nav, linked only from the Cal.com confirmation)

### Architecture decisions
- Astro static output to `dist` only: no React app, no backend, no database.
- Real generated HTML routes and a custom 404. No SPA catch-all rewrites.
- Keep the redirects: /websites, /get-a-mockup, /thanks, /after-launch, /about → /; /terms → /privacy.

### Gotchas
- Static hosting must serve the generated 404 page for missing routes, not rewrite them to the homepage.
- Changes in the editor aren't live until I republish.
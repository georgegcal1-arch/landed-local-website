# Landed Local website

Static Astro foundation for Landed Local, an AI agency for home-service businesses.

## Setup and commands
Run `pnpm install` at the repo root, then:
- `pnpm --filter @workspace/landed-local run dev` - dev server (binds 0.0.0.0, uses $PORT)
- `pnpm --filter @workspace/landed-local run build` - static build to `dist/`
- `pnpm --filter @workspace/landed-local run serve` - preview the build
- `pnpm --filter @workspace/landed-local run typecheck` - astro check
- `node artifacts/landed-local/scripts/verify-static.mjs` (from the workspace root, after build) - verify generated page copy, titles, schema, hidden-page controls, sitemap, redirects and image dimensions against the supplied specification
- `node artifacts/landed-local/scripts/render-og.mjs` (from the workspace root) - rebuild the 1200×630 brand share image using existing fonts, logo and color tokens

## Key files
- `src/config/site.ts` - business facts, contact info, booking copy, audience, tool compatibility, optional results, domain and brand file paths. Every field is commented.
- `src/styles/tokens.css` - colors, radii, shadow, spacing, type sizes. Change a token and it changes everywhere.
- `tailwind.config.cjs` - maps tokens to classes (`bg-paper`, `text-teal`, `rounded-signature`, `shadow-card`, `max-w-content`).
- `src/styles/global.css` - fonts (Fontsource) and global typography.
- `src/layouts/BaseLayout.astro` - shared head (meta, canonical, Open Graph, favicons, theme-color), skip link, main.
- `src/pages/` - Home, /book, /privacy, the hidden /before-our-call, the internal /styleguide and custom 404.
- `src/components/BookSection.astro` - the complete shared Home and /book booking composition; heading defaults to h2, with h1 on /book.
- `public/brand/` - all existing logo, icon and profile tile files, including original names and aliases.

## Editing site.ts
Keep quotes around text and leave true/false unquoted. Use `null` for an unset photo or analytics token. Booking wording is shared with the temporary shell buttons so they stay in sync. The proof, demo and promise switches remain off until approved. Save and the dev server reloads.

## Hidden preparation page
`preCall.loomEmbedUrl` is intentionally empty. Paste the filmed video's Loom **embed** URL there when available; the framed 16:9 placeholder will become a responsive iframe. `preCall.path` records its `/before-our-call` destination. This page has `noindex, nofollow`, no incoming site links, no FAQ schema, no header booking button and no phone action bar. Its logo, phone link and footer are unchanged. Booking-confirmation settings at Cal.com have not been changed.

## Static redirects and search scope
Astro generates immediate HTML redirects for `/websites`, `/get-a-mockup`, `/thanks`, `/after-launch`, `/about` → `/`, and `/terms` → `/privacy`. These files work without a server or JavaScript; production HTTP status codes depend on the static host. The custom `404.html` must be served for missing pages, not replaced by a homepage catch-all. The sitemap and its alias contain only `/`, `/book`, `/privacy`.

Retired offer copy was checked in site source and generated visitor-facing text. A literal repository-wide zero-match search is intentionally **not** an acceptance criterion:
- `/get-a-mockup` must remain as the required redirect address.
- `mockup-sandbox` is an unrelated Canvas artifact, outside this site's scope.
- Historical uploads and dependency/build metadata are preserved.
- Original brand files contain numeric coordinates and path data (including `997` substrings); their contents, names and aliases must remain intact.
- The validation script and this explanation necessarily name the search terms and exceptions.

## Preview checklist for the completed pages
- Home: original seven sections and interactions, with the review section still last. Compare both desktop and 390px with the saved reference views.
- `/book`: only the shared review section between header and footer, with one h1. On desktop the ticket/copy sticks beside the calendar; on phones contact details follow the calendar.
- Both booking surfaces: calendar, changeable time zone, direct booking and contact fallback if Cal.com cannot load. No account or consent-form settings were changed.
- `/privacy`: readable Privacy & Terms, functional email links, Cal.com data and booking-form consent explained, conditional analytics and Ohio terms.
- `/before-our-call`: seven content groups in the supplied order, three numbered cards, 16:9 placeholder, paired lists, steel negative dashes, three next steps and four keyboard-operable FAQs.
- `/404`: exact moved-page message and working Home/booking buttons.
- `/og-image.png`: updated two-line message using existing branding; no photos.

Reference screenshots and browser-check artifacts are under the ignored `generated-artifacts/` workspace directory, not shipped with the site.

# Home and booking design verification

## Automated checks

- `pnpm --filter @workspace/landed-local run typecheck`: passed; no errors, warnings, or hints.
- `pnpm --filter @workspace/landed-local run build`: passed; static output generated.
- `pnpm --filter @workspace/landed-local run verify:static`: passed, including new drafting hero, ticket CTA, charcoal calendar, accessible tool names, and retained site checks.
- `pnpm --filter @workspace/landed-local run verify:booking-redirect`: passed; the official success event still navigates to the configured preparation page.

## Browser results

Home, `/book`, and `/styleguide` were inspected at 375px, 390px, and 1440px.

| Check | Result |
| --- | --- |
| Home headline | Pass: desktop uses two logical lines; phones read “More” / “Landed Jobs.” / “No New Hires.” Only “Landed Jobs.” is burnt orange and underlined. |
| Paper sheet | Pass: readable content, clean top-left bracket, four registration marks and bottom dimension line; no horizontal page overflow. |
| HeroIntro | Pass: ruler, eyebrow, two headline lines, then underline; approximately 1.2–1.3 seconds; no replay after scrolling away and returning. |
| No JavaScript / reduced motion | Pass: hero content remains readable; reduced motion removes animation and shows one centered wrapping tools list without visible or accessible repeat names or toggle. |
| Initial 1440×900 fold | Pass: tools section starts at y=791; heading occupies y=855–893, fully visible beneath the shared header. |
| Tools loop | Pass: leftward motion, 34-second duration, two equal approximately 1548px lists with a decorative repeat; equal list widths and a −50% endpoint provide seamless wrapping. |
| Pause / resume | Pass: keyboard toggle pauses and resumes while retaining focus; viewport click and touch tap also pause/resume. Hover pause is implemented but not browser-verified; see limitation below. |
| CTA ticket | Pass at all three widths: three checked outcomes, “30 min” / “With George”, fully visible orange button with charcoal text and `/book` destination. |
| Calendar card | Pass: charcoal blueprint section, exact heading and subline, centered light 1000px desktop card, rounded corners and shadow; no unnecessary desktop inner scrolling. |
| Time-zone choice | Pass: live official Cal.com selector visible and changeable; changing viewer time zone changed displayed times. No appointment was selected or submitted. |
| Fallback | Pass: same-event secondary-on-charcoal link remains visible after loading; blocking the provider shows the failure message and leaves the fallback usable. |
| Styleguide | Pass: DraftSheet, HeroIntro and ticket CTABand have usage notes; matching hero, bracket, pencil, tools and calendar variants are present; legacy/unrelated samples remain. |

### Limitations

- The test browser reports no hover-capable pointer, even during pointer emulation. The hover media-query rule was confirmed in code, but physical hover behavior could not be confirmed in this environment.
- Cal.com loaded successfully during the check, but remains an external dependency. No real booking was made. Mobile may retain provider-internal scrolling; desktop did not require it.
- Development screenshots include Astro's development toolbar, which is not part of the static production build.

## Changed files

Paths below are relative to `artifacts/landed-local/`.

- `src/components/DraftSheet.astro` — new reusable paper sheet.
- `src/components/HeroIntro.astro` — new once-only introduction sequence.
- `src/components/CornerFrame.astro` — optional top-left bracket; existing default retained.
- `src/components/Hero.astro` — sheet layout and stronger edge-faded hero grid.
- `src/components/ToolStrip.astro` — larger dark-context loop, retaining legacy variants.
- `src/components/CTABand.astro` — optional two-column ticket composition.
- `src/components/BookSection.astro` — separate charcoal blueprint calendar section.
- `src/components/BookingEmbed.astro` — bounded light-card presentation and dark-context fallback.
- `src/pages/index.astro` — adopts the requested hero, tools and CTA variants.
- `src/pages/styleguide.astro` — component demonstrations and usage notes.
- `src/styles/tokens.css` — semantic dimensions, spacing, rotation, shadows and timing.
- `scripts/verify-static.mjs` — updated accessible loop assertions and requested composition checks.
- `DESIGN-VERIFICATION.md` — this report.

Outside the site: project memory records the explicitly requested tools-loop exception to the general once-only animation rule. Astro may regenerate `.astro/types.d.ts` during its checks.

The header, footer, founder layout, unrelated Home sections, booking configuration, booking-success script, API Server and Canvas were not changed.

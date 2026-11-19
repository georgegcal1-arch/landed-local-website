---
name: Astro cross-component CSS specificity
description: Why parent global overrides can lose to scoped child selectors, especially mobile overrides.
---

When overriding a child component from an Astro parent, account for the child's generated scope attributes on each selector compound, not just its visible class count.

**Why:** A demo-local value override appeared more specific in source but still lost to the shared ticket's mobile rule after Astro added scope attributes. That put the label and value into the same grid cell.

**How to apply:** Keep presentation exceptions local to the consuming component, but compare compiled selector specificity against all breakpoint rules. Confirm computed grid placement at mobile widths instead of assuming source order wins.

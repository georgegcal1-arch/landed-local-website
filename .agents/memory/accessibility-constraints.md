---
name: Accessibility constraints
description: User-required visual preservation, accessible brand text colors, and reduced-motion behavior.
---

Performance and accessibility fixes must preserve the existing appearance unless a fix requires a visual change; tell the user when it does.

**Why:** The user explicitly requested this scope.

**How to apply:** Avoid unrelated restyling during audits and disclose necessary changes to color, underlines, spacing, or target sizes.

Do not use white text on orange, including hover states. Use #DD7520 as text only at 24px and above; small orange text uses orange-burnt on light backgrounds. On charcoal, use teal-light for small accent labels rather than orange-burnt, which cannot meet AA there.

**Why:** The user specified the orange text restrictions; small charcoal-background labels need a contrasting alternative.

**How to apply:** Preserve these rules when adding or changing components, including hover and focus states. Decorative marks and logo artwork are not body text.

With prefers-reduced-motion, nothing should animate.

**Why:** The user explicitly required this accessibility behavior.

**How to apply:** Cover CSS transitions, CSS animations, and JavaScript-driven motion, including motion introduced in future components.

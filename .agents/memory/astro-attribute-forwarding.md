---
name: Astro attribute forwarding
description: Explicit attributes in Astro wrappers must be computed from incoming props rather than relying on spread precedence.
---
When an Astro wrapper provides a default HTML attribute, explicitly choose the incoming value or the default. Do not rely on a later spread to override a hardcoded attribute.

**Why:** Astro's explicit attributes take precedence over spreads. A hardcoded button type silently ignored a requested submit type, breaking a form's submit behavior.

**How to apply:** When forwarding HTML attributes through shared components, compute configurable defaults from the received props and verify the rendered HTML for behavior-sensitive attributes.

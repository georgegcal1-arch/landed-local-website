---
name: Astro managed workflows
description: Why Astro development must stay in the foreground in this environment.
---
Astro 7 detects agent environments and may automatically background its development server. Use `astro dev --ignore-lock` for a managed workflow.

**Why:** Automatic backgrounding made the workflow finish immediately and the preview returned 502 despite an initial “server running” message.

**How to apply:** Preserve foreground operation when changing Astro development commands; continue honoring injected PORT and binding to 0.0.0.0.

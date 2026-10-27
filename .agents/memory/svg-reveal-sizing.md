---
name: SVG reveal sizing
description: Preserve full-width strokes when animating responsively scaled SVG marks.
---
Avoid normalized stroke-dash reveals on responsively scaled SVGs that use non-scaling strokes. Use a CSS clip reveal instead.

**Why:** Non-scaling strokes also keep dash lengths from scaling with the SVG. A normalized full-path dash can therefore leave part of a wider mark invisible even when its SVG box exactly matches the text.

**How to apply:** When a decorative SVG must retain a fixed stroke thickness while stretching with text, reveal the SVG with CSS clipping rather than measuring widths or animating normalized dash lengths.

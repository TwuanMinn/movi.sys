# ADR 004 — Tailwind CSS v4 with OKLCH color system

**Date:** 2026-04-01  
**Status:** Accepted

## Context

Tailwind v4 introduces a CSS-first config model. Colors and design tokens are declared in `@theme` blocks inside CSS rather than `tailwind.config.js`. OKLCH provides perceptually uniform color manipulation — consistent lightness across hues.

## Decision

All design tokens (colors, radii, shadows, typography, easing) are declared in `src/app/globals.css` under `@theme`. No `tailwind.config.js` or `tailwind.config.ts` file.

**Color palette rules (locked):**
- Warm charcoal backgrounds (hue ~65, low chroma)
- Amber/red accents only (hue 25–80)
- No purple (hue 270–330)
- No cyan (hue 180–220)
- No glassmorphism

## Consequences

- IDE autocomplete for custom tokens requires Tailwind v4 IntelliSense extension
- All color values must be OKLCH — no hex or rgb in CSS custom properties
- Film grain and backdrop-blur effects are allowed; glass panels are not

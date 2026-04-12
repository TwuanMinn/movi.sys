# Performance Audit

**Date:** 2026-04-11  
**Auditor:** `performance-optimizer`

---

## Bundle Analysis

Run `ANALYZE=true npm run build` after adding `@next/bundle-analyzer` to see the full bundle breakdown.

### Known large dependencies

| Package | Why included | Size impact |
|---------|-------------|-------------|
| `framer-motion` | All animations | ~100KB gzipped — unavoidable |
| `recharts` | Analytics charts | ~80KB — only loaded on `/analytics` |
| `@tanstack/react-table` | DataTable (future) | ~25KB |
| `react-hook-form` | Forms | ~10KB |

### Mitigation patterns already in place

- **Dynamic imports:** `recharts` components should be lazy-loaded on the analytics page when wired to real data
- **Server Components:** Dashboard stats, movie lists default to Server Components — no JS shipped unless `"use client"` is present
- **Motion values:** `SpotlightCard` uses `useMotionValue` to avoid re-renders on mouse move
- **Batched tRPC:** Multiple queries per page are batched into one HTTP request

---

## Core Web Vitals Targets

| Metric | Target | Notes |
|--------|--------|-------|
| LCP | < 2.5s | Main content is text — no hero image |
| FID/INP | < 200ms | Animations are GPU-only (transform/opacity) |
| CLS | < 0.1 | Fixed sidebar, no layout shift after load |

---

## Animation Performance

All Framer Motion animations use only `transform` and `opacity` — never `width`, `height`, `top`, `left` — which keeps them on the compositor thread (no layout/paint cost).

**`prefers-reduced-motion`** — Framer Motion respects this via its `useReducedMotion()` hook. Wrap critical animations:

```tsx
const shouldReduce = useReducedMotion();
<motion.div animate={shouldReduce ? {} : { y: 0, opacity: 1 }} />
```

---

## Recommendations

1. **Add `loading.tsx`** to each dashboard route group — shows a skeleton while server data loads
2. **Lazy-load Recharts** — wrap chart components in `dynamic(() => import(...), { ssr: false })`
3. **Image optimization** — use `next/image` for any movie poster URLs
4. **Prefetch** — sidebar nav links use `<Link prefetch>` by default in Next.js; verify active on internal links

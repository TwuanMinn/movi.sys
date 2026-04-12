# ADR 001 — Use proxy.ts instead of middleware.ts

**Date:** 2026-04-01  
**Status:** Accepted

## Context

Next.js 16 renames `middleware.ts` to `proxy.ts` as part of its breaking routing changes. The file must be co-located at `src/proxy.ts`.

## Decision

Use `src/proxy.ts` for all request interception, session checking, and route protection. Do not use `middleware.ts` — it is no longer recognized.

## Consequences

- Auth guard runs at the edge before any route handler
- Session cookie name is `better-auth.session_token`
- Public paths `/login` and `/api/auth/**` are explicitly bypassed
- All other routes require a valid session; unauthenticated requests redirect to `/login?callbackUrl=<original>`

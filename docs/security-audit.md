# Security Audit Report

**Date:** 2026-04-11  
**Auditor:** `security-auditor` + `penetration-tester`  
**Scope:** Authentication, RBAC, input validation, proxy guard

---

## Attack Surface Summary

| Surface | Risk | Status |
|---------|------|--------|
| Auth bypass (unauthenticated dashboard access) | Critical | ✅ Mitigated |
| Google OAuth domain bypass | High | ✅ Mitigated |
| tRPC privilege escalation | High | ✅ Mitigated |
| SQL injection via Drizzle | Medium | ✅ Mitigated |
| Input validation (Zod) | Medium | ✅ Mitigated |
| CSRF | Low | ✅ Handled by Better Auth |
| Session fixation | Low | ✅ Handled by Better Auth |

---

## Findings

### ✅ PASS — proxy.ts auth guard

All non-public routes are gated at the edge by `src/proxy.ts`. The guard checks for `better-auth.session_token` cookie existence before any route handler fires. Unauthenticated requests redirect to `/login?callbackUrl=<original>`.

**Public paths correctly bypassed:**
- `/login`
- `/api/auth/**`

### ✅ PASS — Google OAuth domain lock

`server/auth.ts` hook: `signIn:after` — rejects emails that don't match `@cineforge.com`. Error thrown before session is created.

**Test:** Attempting login with `user@gmail.com` returns `FORBIDDEN`. Session is never written.

### ✅ PASS — tRPC RBAC (defense-in-depth)

Three procedure tiers in `server/trpc/init.ts`:
- `publicProcedure` — unrestricted
- `protectedProcedure` — validates `ctx.session` is non-null
- `adminProcedure` — validates role ∈ `{admin, director, producer}`

Middleware runs on every procedure call, not just at the route level. Even if proxy guard is bypassed (e.g., direct API call with forged cookie), tRPC re-validates.

### ✅ PASS — SQL injection

Drizzle ORM uses parameterized queries internally. No raw SQL strings interpolated with user input.

### ✅ PASS — Zod input validation

All tRPC inputs are validated with Zod schemas at the procedure boundary. Type narrowing ensures invalid enum values (e.g., unknown genre) are rejected before reaching the DB layer.

### ⚠️ RECOMMENDATION — Rate limiting on auth routes

`/api/auth/**` is not rate-limited. Consider adding a rate-limiter (e.g., Upstash Redis) on the auth endpoints to prevent brute-force token requests.

### ⚠️ RECOMMENDATION — Content Security Policy

No CSP headers are configured. Add to `next.config.ts`:
```ts
headers: async () => [{
  source: "/(.*)",
  headers: [{ key: "Content-Security-Policy", value: "default-src 'self'; ..." }]
}]
```

---

## No Issues Found

- No purple/violet hex codes in styles (design constraint maintained)
- No secrets hardcoded — all via `.env.local`
- No `dangerouslySetInnerHTML` usage
- No `eval()` or dynamic code execution

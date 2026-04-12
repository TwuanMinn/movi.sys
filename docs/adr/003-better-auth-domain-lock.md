# ADR 003 — Better Auth with domain-locked Google OAuth

**Date:** 2026-04-01  
**Status:** Accepted

## Context

This is an internal tool — only @cineforge.com employees should be able to log in. We need to prevent personal Google accounts from gaining access.

## Decision

Use Better Auth with the Google OAuth plugin. A `signIn:after` hook checks the email domain and throws `FORBIDDEN` if it doesn't end with `@cineforge.com`. No password auth — Google OAuth is the sole provider.

## Consequences

- Contractors with non-cineforge emails cannot log in (expected)
- If Google OAuth is down, no one can log in (acceptable for an internal tool)
- Session duration: 7 days, refreshed every 24h
- Cookies are HTTP-only and Secure; no JWT in localStorage

# CINEFORGE API Reference

All API calls go through tRPC at `/api/trpc`. The client is type-safe end-to-end — refer to `src/server/trpc/routers/` for the authoritative source of truth.

## Authentication

All procedures except `publicProcedure` require a valid session cookie (`better-auth.session_token`). Unauthenticated requests return `UNAUTHORIZED`.

### Procedure tiers

| Tier | Who can call |
|------|-------------|
| `publicProcedure` | Anyone |
| `protectedProcedure` | Any authenticated user |
| `adminProcedure` | `admin`, `director`, `producer` roles only |

---

## movies

### `movies.getAll`
**Type:** Query · **Auth:** Protected

Returns all movies, optionally filtered.

**Input (optional):**
```ts
{
  genre?: "action" | "comedy" | "drama" | "horror" | "sci_fi" | "thriller" | "documentary" | "animation" | "romance" | "fantasy"
  status?: "development" | "pre_production" | "production" | "post_production" | "released" | "cancelled"
  search?: string   // ilike match on title
}
```

**Returns:** `Movie[]` with `director` and `producer` relations, ordered by `updatedAt` desc.

---

### `movies.getById`
**Type:** Query · **Auth:** Protected

**Input:** `{ id: string }`

**Returns:** Full movie with `director`, `producer`, `assets`, `tasks` (with assignees), `reviews` (with users).

---

### `movies.create`
**Type:** Mutation · **Auth:** Admin

**Input:**
```ts
{
  title: string          // 1–200 chars
  tagline?: string
  synopsis?: string
  genre: GenreEnum
  budget: number         // USD in millions
  directorId?: string
  producerId?: string
  releaseDate?: string   // ISO date string
  posterUrl?: string     // valid URL
}
```

**Returns:** `{ id: string }`

---

### `movies.update`
**Type:** Mutation · **Auth:** Admin

**Input:** `{ id: string, ...partial Movie fields }`

**Returns:** `{ success: true }`

---

### `movies.delete`
**Type:** Mutation · **Auth:** Admin

**Input:** `{ id: string }`

**Returns:** `{ success: true }`

---

## users

### `users.getAll`
**Type:** Query · **Auth:** Protected

Returns all active users with role and department.

### `users.updateRole`
**Type:** Mutation · **Auth:** Admin

**Input:** `{ id: string, role: UserRoleEnum }`

---

## assets

### `assets.getByMovie`
**Type:** Query · **Auth:** Protected

**Input:** `{ movieId: string }`

**Returns:** All assets for a movie, with `uploadedBy` and `reviewedBy` relations.

### `assets.updateStatus`
**Type:** Mutation · **Auth:** Admin

**Input:**
```ts
{
  id: string
  status: "pending" | "approved" | "rejected" | "archived"
  reviewedById: string
  notes?: string
}
```

### `assets.delete`
**Type:** Mutation · **Auth:** Admin

**Input:** `{ id: string }`

---

## tasks

### `tasks.getByMovie`
**Type:** Query · **Auth:** Protected

**Input:** `{ movieId: string }`

**Returns:** Tasks with assignee relations, ordered by priority.

### `tasks.create`
**Type:** Mutation · **Auth:** Admin

### `tasks.complete`
**Type:** Mutation · **Auth:** Protected

**Input:** `{ id: string }`

---

## activities

### `activities.getByMovie`
**Type:** Query · **Auth:** Protected

**Input:** `{ movieId: string, limit?: number }`

Returns audit trail for a movie, newest first.

### `activities.getRecent`
**Type:** Query · **Auth:** Protected

**Input:** `{ limit?: number }` (default 20)

Returns studio-wide recent activity feed.

---

## analytics

### `analytics.getSummary`
**Type:** Query · **Auth:** Admin

Returns aggregate stats:
```ts
{
  summary: {
    totalMovies: number
    totalBudget: string   // SQL sum → string
    totalSpent: string
    totalRevenue: string
    avgBudget: string
  }
  byStatus: { status: MovieStatus, count: number }[]
  byGenre: { genre: Genre, count: number, totalBudget: string, totalRevenue: string }[]
}
```

---

## Error codes

| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | No session or expired |
| `FORBIDDEN` | Insufficient role |
| `NOT_FOUND` | Resource doesn't exist |
| `BAD_REQUEST` | Zod validation failed |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

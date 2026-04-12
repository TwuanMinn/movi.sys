import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";

/**
 * @backend-specialist: tRPC context — creates per-request context with:
 * - Database instance
 * - Session (from Better Auth cookie)
 *
 * Session is resolved lazily from cookies on every request.
 */

export async function createContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    db,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

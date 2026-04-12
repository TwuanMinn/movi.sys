import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import type { UserRole } from "@/types";

/**
 * @backend-specialist: tRPC initialization with layered procedures:
 * - publicProcedure: no auth required
 * - protectedProcedure: session required (all logged-in staff)
 * - adminProcedure: admin/director/producer roles only
 *
 * @security-auditor: Auth checks at procedure level = defense-in-depth.
 */

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

const ELEVATED_ROLES: UserRole[] = ["admin", "director", "producer"];

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const userRole = (ctx.session.user as { role?: UserRole }).role;
  if (!userRole || !ELEVATED_ROLES.includes(userRole)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Insufficient permissions",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);

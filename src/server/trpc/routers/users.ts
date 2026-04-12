import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../init";
import { users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const usersRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });
  }),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum([
          "admin",
          "director",
          "producer",
          "editor",
          "cinematographer",
          "sound_engineer",
          "vfx_artist",
          "user",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(users.id, input.id));
      return { success: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(users.id, input.id));
      return { success: true };
    }),
});

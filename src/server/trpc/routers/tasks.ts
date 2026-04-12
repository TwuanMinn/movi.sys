import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { tasks } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const tasksRouter = router({
  getByMovie: protectedProcedure
    .input(z.object({ movieId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tasks.findMany({
        where: eq(tasks.movieId, input.movieId),
        orderBy: [desc(tasks.createdAt)],
        with: { assignee: true },
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string(), isCompleted: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isCompleted: input.isCompleted, updatedAt: new Date() })
        .where(eq(tasks.id, input.id));
      return { success: true };
    }),

  assign: protectedProcedure
    .input(z.object({ id: z.string(), assigneeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ assigneeId: input.assigneeId, updatedAt: new Date() })
        .where(eq(tasks.id, input.id));
      return { success: true };
    }),
});

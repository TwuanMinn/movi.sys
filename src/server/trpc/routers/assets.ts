import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../init";
import { assets } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const assetsRouter = router({
  getByMovie: protectedProcedure
    .input(z.object({ movieId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.assets.findMany({
        where: eq(assets.movieId, input.movieId),
        orderBy: [desc(assets.createdAt)],
        with: { uploadedBy: true, reviewedBy: true },
      });
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "approved", "rejected", "archived"]),
        reviewedById: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db
        .update(assets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(assets.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(assets).where(eq(assets.id, input.id));
      return { success: true };
    }),
});

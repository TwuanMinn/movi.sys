import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../init";
import { movies, genreEnum, movieStatusEnum } from "@/server/db/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

/**
 * @backend-specialist: Movies CRUD with type-safe enum validation.
 * Genre and status inputs use the actual DB enum values for type safety.
 */

const genreValues = genreEnum.enumValues;
const statusValues = movieStatusEnum.enumValues;

export const moviesRouter = router({
  getAll: protectedProcedure
    .input(
      z
        .object({
          genre: z.enum(genreValues).optional(),
          status: z.enum(statusValues).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input?.genre) {
        conditions.push(eq(movies.genre, input.genre));
      }
      if (input?.status) {
        conditions.push(eq(movies.status, input.status));
      }
      if (input?.search) {
        conditions.push(ilike(movies.title, `%${input.search}%`));
      }

      return ctx.db.query.movies.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(movies.updatedAt)],
        with: {
          director: true,
          producer: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.movies.findFirst({
        where: eq(movies.id, input.id),
        with: {
          director: true,
          producer: true,
          assets: true,
          tasks: { with: { assignee: true } },
          reviews: { with: { user: true } },
        },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        tagline: z.string().optional(),
        synopsis: z.string().optional(),
        genre: z.enum(genreValues),
        budget: z.number().min(0),
        directorId: z.string().optional(),
        producerId: z.string().optional(),
        releaseDate: z.string().optional(),
        posterUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(movies).values({
        id,
        title: input.title,
        tagline: input.tagline,
        synopsis: input.synopsis,
        genre: input.genre,
        budget: input.budget,
        directorId: input.directorId,
        producerId: input.producerId,
        posterUrl: input.posterUrl,
        releaseDate: input.releaseDate ? new Date(input.releaseDate) : undefined,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        tagline: z.string().optional(),
        synopsis: z.string().optional(),
        genre: z.enum(genreValues).optional(),
        status: z.enum(statusValues).optional(),
        budget: z.number().min(0).optional(),
        spent: z.number().min(0).optional(),
        revenue: z.number().min(0).optional(),
        directorId: z.string().optional(),
        producerId: z.string().optional(),
        posterUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(movies)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.tagline !== undefined && { tagline: input.tagline }),
          ...(input.synopsis !== undefined && { synopsis: input.synopsis }),
          ...(input.genre !== undefined && { genre: input.genre }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.budget !== undefined && { budget: input.budget }),
          ...(input.spent !== undefined && { spent: input.spent }),
          ...(input.revenue !== undefined && { revenue: input.revenue }),
          ...(input.directorId !== undefined && { directorId: input.directorId }),
          ...(input.producerId !== undefined && { producerId: input.producerId }),
          ...(input.posterUrl !== undefined && { posterUrl: input.posterUrl }),
          updatedAt: new Date(),
        })
        .where(eq(movies.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(movies).where(eq(movies.id, input.id));
      return { success: true };
    }),
});

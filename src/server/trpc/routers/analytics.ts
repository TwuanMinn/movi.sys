import { router, adminProcedure } from "../init";
import { movies } from "@/server/db/schema";
import { count, sum, avg } from "drizzle-orm";

/**
 * @database-architect: Analytics queries use SQL aggregates,
 * not in-app computation. DB does the heavy lifting.
 */

export const analyticsRouter = router({
  getSummary: adminProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalMovies: count(),
        totalBudget: sum(movies.budget),
        totalSpent: sum(movies.spent),
        totalRevenue: sum(movies.revenue),
        avgBudget: avg(movies.budget),
      })
      .from(movies);

    const statusBreakdown = await ctx.db
      .select({
        status: movies.status,
        count: count(),
      })
      .from(movies)
      .groupBy(movies.status);

    const genreBreakdown = await ctx.db
      .select({
        genre: movies.genre,
        count: count(),
        totalBudget: sum(movies.budget),
        totalRevenue: sum(movies.revenue),
      })
      .from(movies)
      .groupBy(movies.genre);

    return {
      summary: stats,
      byStatus: statusBreakdown,
      byGenre: genreBreakdown,
    };
  }),
});

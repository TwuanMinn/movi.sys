import { router, protectedProcedure } from "../init";
import { activities } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export const activitiesRouter = router({
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.activities.findMany({
      orderBy: [desc(activities.createdAt)],
      limit: 20,
      with: { user: true, movie: true },
    });
  }),
});

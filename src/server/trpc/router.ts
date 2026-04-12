import { router } from "./init";
import { moviesRouter } from "./routers/movies";
import { usersRouter } from "./routers/users";
import { assetsRouter } from "./routers/assets";
import { tasksRouter } from "./routers/tasks";
import { activitiesRouter } from "./routers/activities";
import { analyticsRouter } from "./routers/analytics";

export const appRouter = router({
  movies: moviesRouter,
  users: usersRouter,
  assets: assetsRouter,
  tasks: tasksRouter,
  activities: activitiesRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

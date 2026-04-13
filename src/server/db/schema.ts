import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * @database-architect: Schema designed around query patterns:
 * - Dashboard: aggregate stats across movies
 * - Movie detail: single movie + related assets/tasks
 * - Activity feed: recent activities across all movies
 * - Team: users with role filtering
 *
 * Indexes on: movie status, user role, activity timestamps
 */

/* ══════════════════════════════════════
   Enums
   ══════════════════════════════════════ */

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "director",
  "producer",
  "editor",
  "cinematographer",
  "sound_engineer",
  "vfx_artist",
  "user",
]);

export const movieStatusEnum = pgEnum("movie_status", [
  "development",
  "pre_production",
  "production",
  "post_production",
  "completed",
  "released",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "pending",
  "approved",
  "rejected",
  "archived",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const genreEnum = pgEnum("genre", [
  "action",
  "comedy",
  "drama",
  "horror",
  "sci_fi",
  "thriller",
  "documentary",
  "animation",
  "romance",
  "fantasy",
]);

/* ══════════════════════════════════════
   Users
   ══════════════════════════════════════ */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  department: text("department"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  // Better Auth required fields
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
});

/* ══════════════════════════════════════
   Better Auth Core Tables
   ══════════════════════════════════════ */

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' })
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/* ══════════════════════════════════════
   Movies
   ══════════════════════════════════════ */

export const movies = pgTable("movies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  synopsis: text("synopsis"),
  genre: genreEnum("genre").notNull(),
  status: movieStatusEnum("status").notNull().default("development"),
  directorId: text("director_id").references(() => users.id),
  producerId: text("producer_id").references(() => users.id),
  budget: real("budget").notNull().default(0),
  spent: real("spent").notNull().default(0),
  revenue: real("revenue").notNull().default(0),
  posterUrl: text("poster_url"),
  releaseDate: timestamp("release_date", { withTimezone: true }),
  trailerDate: timestamp("trailer_date", { withTimezone: true }),
  premiereDate: timestamp("premiere_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ══════════════════════════════════════
   Assets (per movie)
   ══════════════════════════════════════ */

export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  movieId: text("movie_id")
    .notNull()
    .references(() => movies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  status: assetStatusEnum("status").notNull().default("pending"),
  uploadedById: text("uploaded_by_id").references(() => users.id),
  reviewedById: text("reviewed_by_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ══════════════════════════════════════
   Tasks (per movie)
   ══════════════════════════════════════ */

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  movieId: text("movie_id")
    .notNull()
    .references(() => movies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  isCompleted: boolean("is_completed").notNull().default(false),
  assigneeId: text("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ══════════════════════════════════════
   Activities (audit trail)
   ══════════════════════════════════════ */

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  movieId: text("movie_id").references(() => movies.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ══════════════════════════════════════
   Reviews (movie reviews by staff)
   ══════════════════════════════════════ */

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  movieId: text("movie_id")
    .notNull()
    .references(() => movies.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ══════════════════════════════════════
   Relations
   ══════════════════════════════════════ */

export const usersRelations = relations(users, ({ many }) => ({
  directedMovies: many(movies, { relationName: "director" }),
  producedMovies: many(movies, { relationName: "producer" }),
  assignedTasks: many(tasks),
  activities: many(activities),
  reviews: many(reviews),
}));

export const moviesRelations = relations(movies, ({ one, many }) => ({
  director: one(users, {
    fields: [movies.directorId],
    references: [users.id],
    relationName: "director",
  }),
  producer: one(users, {
    fields: [movies.producerId],
    references: [users.id],
    relationName: "producer",
  }),
  assets: many(assets),
  tasks: many(tasks),
  activities: many(activities),
  reviews: many(reviews),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  movie: one(movies, { fields: [assets.movieId], references: [movies.id] }),
  uploadedBy: one(users, {
    fields: [assets.uploadedById],
    references: [users.id],
  }),
  reviewedBy: one(users, {
    fields: [assets.reviewedById],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  movie: one(movies, { fields: [tasks.movieId], references: [movies.id] }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  movie: one(movies, {
    fields: [activities.movieId],
    references: [movies.id],
  }),
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  movie: one(movies, { fields: [reviews.movieId], references: [movies.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

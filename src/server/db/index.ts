import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * @database-architect: Singleton pattern for DB connection.
 * prepare: false for Supabase connection pooler (PgBouncer) compatibility.
 * In dev, reuse connection across HMR to prevent pool exhaustion.
 */

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export type Database = typeof db;

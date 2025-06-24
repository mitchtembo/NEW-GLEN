import { defineConfig } from "drizzle-kit";
import path from "path";

// Use SQLite for local development by default
const isSQLite = !process.env.DATABASE_URL || process.env.NODE_ENV !== 'production';
const dataDir = path.join(process.cwd(), 'data');
const sqliteDbPath = path.join(dataDir, 'glencity.db');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite 
    ? { url: `file:${sqliteDbPath}` }
    : { url: process.env.DATABASE_URL as string },
});

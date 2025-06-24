import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import path from 'path';
import fs from 'fs';

neonConfig.webSocketConstructor = ws;

// Create a data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create and use SQLite database for local development
const sqliteDbPath = path.join(dataDir, 'glencity.db');
const sqlite = new Database(sqliteDbPath);

// Run migrations for SQLite
// Create accommodations table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS accommodations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    max_guests INTEGER NOT NULL,
    amenities TEXT NOT NULL DEFAULT '[]',
    image_url TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1
  )
`);

// Create activities table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1
  )
`);

// Create bookings table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    accommodation_id INTEGER NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guests INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create activity_bookings table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS activity_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    scheduled_date TEXT,
    price REAL NOT NULL
  )
`);

export const db = drizzleSQLite(sqlite, { schema });

// Neon DB setup is kept for production but not used in development
let pool, neonDb;
if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  neonDb = drizzle({ client: pool, schema });
}
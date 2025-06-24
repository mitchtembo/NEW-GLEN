import Database from "better-sqlite3";
import * as schema from '@shared/schema';

export function migrateDatabase(db: any) {
  console.log("🔄 Running database migrations...");
  
  try {
    // Create accommodations table
    db.run(`
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
    db.run(`
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
    db.run(`
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
    db.run(`
      CREATE TABLE IF NOT EXISTS activity_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        activity_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        scheduled_date TEXT,
        price REAL NOT NULL
      )
    `);

    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    throw error;
  }
}

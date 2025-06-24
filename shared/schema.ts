import { sqliteTable, text, integer, numeric, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Accommodations table
export const accommodations = sqliteTable("accommodations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // 'chalet', 'dorm', 'camping'
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: text("amenities").notNull().default('[]'),
  imageUrl: text("image_url").notNull(),
  available: integer("available", { mode: 'boolean' }).notNull().default(true),
});

// Activities table
export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  available: integer("available", { mode: 'boolean' }).notNull().default(true),
});

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  accommodationId: integer("accommodation_id").notNull(),
  checkIn: text("check_in").notNull(), // SQLite doesn't have timestamp type, so we use text
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull().default('confirmed'), // 'confirmed', 'checked-in', 'checked-out', 'cancelled'
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Activity bookings table
export const activityBookings = sqliteTable("activity_bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull(),
  activityId: integer("activity_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  scheduledDate: text("scheduled_date"),
  price: real("price").notNull(),
});

// Schema exports
export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  checkIn: z.string(),
  checkOut: z.string(),
  activities: z.array(z.object({
    activityId: z.number(),
    quantity: z.number().default(1),
    scheduledDate: z.string().optional(),
  })).optional(),
});

export const insertActivityBookingSchema = createInsertSchema(activityBookings).omit({
  id: true,
});

// Type exports
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertActivityBooking = z.infer<typeof insertActivityBookingSchema>;
export type ActivityBooking = typeof activityBookings.$inferSelect;

// Extended types for API responses
export type BookingWithDetails = Booking & {
  accommodation: Accommodation;
  activityBookings: (ActivityBooking & { activity: Activity })[];
};

import { pgTable, text, serial, integer, timestamp, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Accommodations table
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'chalet', 'dorm', 'camping'
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  accommodationId: integer("accommodation_id").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default('confirmed'), // 'confirmed', 'checked-in', 'checked-out', 'cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Activity bookings table
export const activityBookings = pgTable("activity_bookings", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  activityId: integer("activity_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  scheduledDate: timestamp("scheduled_date"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
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

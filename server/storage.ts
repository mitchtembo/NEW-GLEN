import { 
  accommodations, 
  activities, 
  bookings, 
  activityBookings,
  type Accommodation, 
  type Activity, 
  type Booking, 
  type ActivityBooking,
  type InsertAccommodation,
  type InsertActivity,
  type InsertBooking,
  type InsertActivityBooking,
  type BookingWithDetails
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Accommodations
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<BookingWithDetails | undefined>;
  getBookingsByEmail(email: string): Promise<BookingWithDetails[]>;
  createBooking(booking: InsertBooking): Promise<BookingWithDetails>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking | undefined>;
  
  // Activity Bookings
  createActivityBooking(activityBooking: InsertActivityBooking): Promise<ActivityBooking>;
  getActivityBookingsByBookingId(bookingId: number): Promise<ActivityBooking[]>;
}

export class MemStorage implements IStorage {
  private accommodations: Map<number, Accommodation>;
  private activities: Map<number, Activity>;
  private bookings: Map<number, Booking>;
  private activityBookings: Map<number, ActivityBooking>;
  private currentAccommodationId: number;
  private currentActivityId: number;
  private currentBookingId: number;
  private currentActivityBookingId: number;

  constructor() {
    this.accommodations = new Map();
    this.activities = new Map();
    this.bookings = new Map();
    this.activityBookings = new Map();
    this.currentAccommodationId = 1;
    this.currentActivityId = 1;
    this.currentBookingId = 1;
    this.currentActivityBookingId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed accommodations
    const seedAccommodations: InsertAccommodation[] = [
      {
        type: 'chalet',
        name: 'Luxury Mountain Chalet',
        description: 'Spacious wooden chalets with full amenities, private bathrooms, and stunning mountain views.',
        pricePerNight: '180.00',
        maxGuests: 6,
        amenities: ['WiFi', 'Private Bath', 'Fireplace', 'Kitchen', 'Mountain View'],
        imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
        available: true
      },
      {
        type: 'dorm',
        name: 'Shared Dormitory',
        description: 'Comfortable bunk beds in shared accommodations, perfect for solo travelers and groups.',
        pricePerNight: '45.00',
        maxGuests: 1,
        amenities: ['WiFi', 'Shared Bath', 'Lockers', 'Common Area'],
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
        available: true
      },
      {
        type: 'camping',
        name: 'Premium Camping Spot',
        description: 'Designated camping areas with fire pits and access to shared facilities for the true outdoor experience.',
        pricePerNight: '25.00',
        maxGuests: 4,
        amenities: ['Fire Pit', 'Shared Facilities', 'Parking', 'Picnic Table'],
        imageUrl: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
        available: true
      }
    ];

    seedAccommodations.forEach(acc => this.createAccommodation(acc));

    // Seed activities
    const seedActivities: InsertActivity[] = [
      {
        name: 'Horse Riding',
        description: 'Explore mountain trails on horseback with experienced guides.',
        price: '75.00',
        category: 'adventure',
        imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      },
      {
        name: 'Quad Biking',
        description: 'Thrilling off-road adventures through forest trails.',
        price: '90.00',
        category: 'adventure',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      },
      {
        name: 'Team Building',
        description: 'Professional facilitated team activities and challenges.',
        price: '120.00',
        category: 'group',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      },
      {
        name: 'Guided Hiking',
        description: 'Discover hidden trails and scenic viewpoints with local guides.',
        price: '45.00',
        category: 'nature',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      },
      {
        name: 'Lake Kayaking',
        description: 'Peaceful paddling on crystal clear mountain lakes.',
        price: '55.00',
        category: 'water',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      },
      {
        name: 'Meal Package',
        description: 'Full-day dining with locally sourced ingredients.',
        price: '35.00',
        category: 'dining',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        available: true
      }
    ];

    seedActivities.forEach(activity => this.createActivity(activity));
  }

  // Accommodations
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentAccommodationId++;
    const accommodation: Accommodation = { ...insertAccommodation, id };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const accommodation = this.accommodations.get(booking.accommodationId);
    if (!accommodation) return undefined;

    const activityBookings = Array.from(this.activityBookings.values())
      .filter(ab => ab.bookingId === id)
      .map(ab => {
        const activity = this.activities.get(ab.activityId);
        return activity ? { ...ab, activity } : null;
      })
      .filter(Boolean) as (ActivityBooking & { activity: Activity })[];

    return {
      ...booking,
      accommodation,
      activityBookings
    };
  }

  async getBookingsByEmail(email: string): Promise<BookingWithDetails[]> {
    const userBookings = Array.from(this.bookings.values())
      .filter(booking => booking.guestEmail === email);

    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of userBookings) {
      const details = await this.getBooking(booking.id);
      if (details) {
        bookingsWithDetails.push(details);
      }
    }

    return bookingsWithDetails;
  }

  async createBooking(insertBooking: InsertBooking): Promise<BookingWithDetails> {
    const id = this.currentBookingId++;
    const { activities: bookingActivities, ...bookingData } = insertBooking;
    
    const booking: Booking = {
      ...bookingData,
      id,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      createdAt: new Date()
    };
    
    this.bookings.set(id, booking);

    // Create activity bookings if any
    if (bookingActivities) {
      for (const activityBooking of bookingActivities) {
        await this.createActivityBooking({
          bookingId: id,
          activityId: activityBooking.activityId,
          quantity: activityBooking.quantity,
          scheduledDate: activityBooking.scheduledDate ? new Date(activityBooking.scheduledDate) : null,
          price: this.activities.get(activityBooking.activityId)?.price || '0.00'
        });
      }
    }

    const result = await this.getBooking(id);
    if (!result) throw new Error('Failed to create booking');
    return result;
  }

  async updateBooking(id: number, updateData: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, ...updateData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Activity Bookings
  async createActivityBooking(insertActivityBooking: InsertActivityBooking): Promise<ActivityBooking> {
    const id = this.currentActivityBookingId++;
    const activityBooking: ActivityBooking = { ...insertActivityBooking, id };
    this.activityBookings.set(id, activityBooking);
    return activityBooking;
  }

  async getActivityBookingsByBookingId(bookingId: number): Promise<ActivityBooking[]> {
    return Array.from(this.activityBookings.values())
      .filter(ab => ab.bookingId === bookingId);
  }
}

export class DatabaseStorage implements IStorage {
  async getAccommodations(): Promise<Accommodation[]> {
    const results = await db.select().from(accommodations);
    // Parse amenities from JSON string to array
    return results.map(acc => ({
      ...acc,
      amenities: typeof acc.amenities === 'string' ? JSON.parse(acc.amenities as string) : acc.amenities
    }));
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    const [accommodation] = await db.select().from(accommodations).where(eq(accommodations.id, id));
    if (!accommodation) return undefined;
    
    // Parse amenities from JSON string to array
    return {
      ...accommodation,
      amenities: typeof accommodation.amenities === 'string' ? JSON.parse(accommodation.amenities as string) : accommodation.amenities
    };
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const [accommodation] = await db
      .insert(accommodations)
      .values(insertAccommodation)
      .returning();
    return accommodation;
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    if (!booking) return undefined;

    const accommodation = await this.getAccommodation(booking.accommodationId);
    if (!accommodation) return undefined;

    const activityBookingsData = await db
      .select({
        id: activityBookings.id,
        bookingId: activityBookings.bookingId,
        activityId: activityBookings.activityId,
        quantity: activityBookings.quantity,
        scheduledDate: activityBookings.scheduledDate,
        price: activityBookings.price,
        activity: activities
      })
      .from(activityBookings)
      .innerJoin(activities, eq(activityBookings.activityId, activities.id))
      .where(eq(activityBookings.bookingId, id));

    return {
      ...booking,
      accommodation,
      activityBookings: activityBookingsData.map(ab => ({
        id: ab.id,
        bookingId: ab.bookingId,
        activityId: ab.activityId,
        quantity: ab.quantity,
        scheduledDate: ab.scheduledDate,
        price: ab.price,
        activity: ab.activity
      }))
    };
  }

  async getBookingsByEmail(email: string): Promise<BookingWithDetails[]> {
    const userBookings = await db.select().from(bookings).where(eq(bookings.guestEmail, email));
    
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of userBookings) {
      const details = await this.getBooking(booking.id);
      if (details) {
        bookingsWithDetails.push(details);
      }
    }

    return bookingsWithDetails;
  }

  async createBooking(insertBooking: InsertBooking): Promise<BookingWithDetails> {
    const { activities: bookingActivities, ...bookingData } = insertBooking;
    
    const [booking] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
      })
      .returning();

    // Create activity bookings if any
    if (bookingActivities) {
      for (const activityBooking of bookingActivities) {
        const activity = await this.getActivity(activityBooking.activityId);
        await db.insert(activityBookings).values({
          bookingId: booking.id,
          activityId: activityBooking.activityId,
          quantity: activityBooking.quantity,
          scheduledDate: activityBooking.scheduledDate ? new Date(activityBooking.scheduledDate) : null,
          price: activity?.price || '0.00'
        });
      }
    }

    const result = await this.getBooking(booking.id);
    if (!result) throw new Error('Failed to create booking');
    return result;
  }

  async updateBooking(id: number, updateData: Partial<Booking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    
    return updatedBooking || undefined;
  }

  async createActivityBooking(insertActivityBooking: InsertActivityBooking): Promise<ActivityBooking> {
    const [activityBooking] = await db
      .insert(activityBookings)
      .values(insertActivityBooking)
      .returning();
    return activityBooking;
  }

  async getActivityBookingsByBookingId(bookingId: number): Promise<ActivityBooking[]> {
    return await db.select().from(activityBookings).where(eq(activityBookings.bookingId, bookingId));
  }
}

export const storage = new DatabaseStorage();

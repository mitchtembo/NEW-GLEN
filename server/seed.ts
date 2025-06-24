import { db } from "./db";
import { accommodations, activities } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Check if data already exists
  const existingAccommodations = await db.select().from(accommodations);
  if (existingAccommodations.length > 0) {
    console.log("✅ Database already seeded");
    return;
  }

  // Helper function to stringify JSON for SQLite
  const stringifyAmenities = (arr: string[]) => JSON.stringify(arr);

  // Seed accommodations
  const seedAccommodations = [
    {
      type: 'chalet',
      name: 'Luxury Mountain Chalet',
      description: 'Spacious wooden chalets with full amenities, private bathrooms, and stunning mountain views.',
      pricePerNight: 180.00,
      maxGuests: 6,
      amenities: stringifyAmenities(['WiFi', 'Private Bath', 'Fireplace', 'Kitchen', 'Mountain View']),
      imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      available: true
    },
    {
      type: 'dorm',
      name: 'Shared Dormitory',
      description: 'Comfortable bunk beds in shared accommodations, perfect for solo travelers and groups.',
      pricePerNight: 45.00,
      maxGuests: 1,
      amenities: stringifyAmenities(['WiFi', 'Shared Bath', 'Lockers', 'Common Area']),
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      available: true
    },
    {
      type: 'camping',
      name: 'Premium Camping Spot',
      description: 'Designated camping areas with fire pits and access to shared facilities for the true outdoor experience.',
      pricePerNight: 25.00,
      maxGuests: 4,
      amenities: stringifyAmenities(['Fire Pit', 'Shared Facilities', 'Parking', 'Picnic Table']),
      imageUrl: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      available: true
    }
  ];

  // Seed activities
  const seedActivities = [
    {
      name: 'Horse Riding',
      description: 'Explore mountain trails on horseback with experienced guides.',
      price: 75.00,
      category: 'adventure',
      imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    },
    {
      name: 'Quad Biking',
      description: 'Thrilling off-road adventures through forest trails.',
      price: 90.00,
      category: 'adventure',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    },
    {
      name: 'Team Building',
      description: 'Professional facilitated team activities and challenges.',
      price: 120.00,
      category: 'group',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    },
    {
      name: 'Guided Hiking',
      description: 'Discover hidden trails and scenic viewpoints with local guides.',
      price: 45.00,
      category: 'nature',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    },
    {
      name: 'Lake Kayaking',
      description: 'Peaceful paddling on crystal clear mountain lakes.',
      price: 55.00,
      category: 'water',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    },
    {
      name: 'Meal Package',
      description: 'Full-day dining with locally sourced ingredients.',
      price: 35.00,
      category: 'dining',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      available: true
    }
  ];

  try {
    // Insert accommodations
    await db.insert(accommodations).values(seedAccommodations);
    console.log("✅ Accommodations seeded");

    // Insert activities
    await db.insert(activities).values(seedActivities);
    console.log("✅ Activities seeded");

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

export { seedDatabase };
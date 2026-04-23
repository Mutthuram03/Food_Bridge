import bcrypt from "bcryptjs";

export function createSeedData() {
  const now = Date.now();

  const passwordHash = bcrypt.hashSync("test123", 10);

  const users = [
    {
      id: 1,
      name: "Spice Garden",
      role: "restaurant",
      email: "hotel@test.com",
      passwordHash,
    },
    {
      id: 102,
      name: "Priya Nair",
      role: "volunteer",
      email: "volunteer@test.com",
      passwordHash,
    },
    {
      id: 201,
      name: "Hope Foundation",
      role: "shelter",
      email: "shelter@test.com",
      passwordHash,
    },
  ];

  const foodListings = [
    {
      id: 1,
      name: "Biryani & Curries",
      restaurantId: 1,
      restaurant: "Spice Garden",
      type: "Cooked Meal",
      quantity: "25 portions",
      pickupTime: "6:00 PM",
      expiryMs: now + 2_700_000,
      location: "Koramangala, Bangalore",
      status: "Available",
      image: "🍛",
      distance: "1.2 km",
      lat: 12.934,
      lng: 77.616,
    },
    {
      id: 2,
      name: "Fresh Bread Loaves",
      restaurantId: 2,
      restaurant: "Artisan Bakehouse",
      type: "Bakery",
      quantity: "40 loaves",
      pickupTime: "7:30 PM",
      expiryMs: now + 5_400_000,
      location: "Indiranagar, Bangalore",
      status: "Available",
      image: "🍞",
      distance: "2.8 km",
      lat: 12.978,
      lng: 77.641,
    },
  ];

  const deliveries = [
    {
      id: 1,
      foodId: 10,
      food: "Pasta & Salads",
      quantity: "18 portions",
      restaurantId: 1,
      restaurant: "Spice Garden",
      volunteerId: 102,
      volunteer: "Priya Nair",
      eta: "20 min",
      status: "In Transit",
    },
  ];

  const shelters = [
    {
      id: 1,
      name: "Hope Foundation",
      capacity: 120,
      currentOccupancy: 89,
      address: "BTM Layout, Bangalore",
      contact: "Meena Krishnan",
      meals: 234,
      lat: 12.916,
      lng: 77.615,
    },
  ];

  const stats = {
    mealsSaved: 18472,
    restaurants: 142,
    volunteers: 389,
    wasteReduced: 9.2,
  };

  return { users, foodListings, deliveries, shelters, stats };
}

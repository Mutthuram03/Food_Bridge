import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Initial Mock Data
const initialFoodListings = [
  { id: 1, name: "Biryani & Curries", restaurantId: 1, restaurant: "Spice Garden", type: "Cooked Meal", quantity: "25 portions", pickupTime: "6:00 PM", expiryMs: Date.now() + 2700000, location: "Koramangala, Bangalore", status: "Available", image: "🍛", distance: "1.2 km", lat: 12.934, lng: 77.616 },
  { id: 2, name: "Fresh Bread Loaves", restaurantId: 2, restaurant: "Artisan Bakehouse", type: "Bakery", quantity: "40 loaves", pickupTime: "7:30 PM", expiryMs: Date.now() + 5400000, location: "Indiranagar, Bangalore", status: "Available", image: "🍞", distance: "2.8 km", lat: 12.978, lng: 77.641 },
];

const initialDeliveries = [
  { id: 1, foodId: 10, food: "Pasta & Salads", quantity: "18 portions", restaurantId: 1, restaurant: "Spice Garden", volunteerId: 102, volunteer: "Priya Nair", eta: "20 min", status: "In Transit" },
];

const initialShelters = [
  { id: 1, name: "Hope Foundation", capacity: 120, currentOccupancy: 89, address: "BTM Layout, Bangalore", contact: "Meena Krishnan", meals: 234, lat: 12.916, lng: 77.615 },
];

const MOCK_USERS = [
  { id: 1, name: "Spice Garden", role: "restaurant", email: "hotel@test.com" },
  { id: 102, name: "Priya Nair", role: "volunteer", email: "volunteer@test.com" },
  { id: 201, name: "Hope Foundation", role: "shelter", email: "shelter@test.com" },
];

export const GlobalProvider = ({ children }) => {
  // Pull from local storage to allow persistent sessions
  const loadStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('fb_currentUser')) || null; } 
    catch { return null; }
  };
  const loadDbUsers = () => {
    try { return JSON.parse(localStorage.getItem('fb_users')) || MOCK_USERS; }
    catch { return MOCK_USERS; }
  };

  const [currentUser, setCurrentUser] = useState(loadStoredUser()); 
  const [dbUsers, setDbUsers] = useState(loadDbUsers());
  
  const [foodListings, setFoodListings] = useState(initialFoodListings);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [shelters, setShelters] = useState(initialShelters);
  const [stats, setStats] = useState({ mealsSaved: 18472, restaurants: 142, volunteers: 389, wasteReduced: 9.2 });

  // Real Auth Methods
  const register = (name, email, password, role) => {
     if (dbUsers.find(u => u.email === email)) return { error: "Email already exists" };
     const newUser = { id: Date.now(), name, email, password, role };
     const updatedUsers = [...dbUsers, newUser];
     setDbUsers(updatedUsers);
     localStorage.setItem('fb_users', JSON.stringify(updatedUsers));
     setCurrentUser(newUser);
     localStorage.setItem('fb_currentUser', JSON.stringify(newUser));
     return { success: true };
  };

  const login = (email, password) => {
    const user = dbUsers.find(u => u.email === email && u.password === password);
    if (!user) return { error: "Invalid credentials" };
    setCurrentUser(user);
    localStorage.setItem('fb_currentUser', JSON.stringify(user));
    return { success: true };
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fb_currentUser');
  };

  // Add new food listing from restaurant
  const postFood = (food) => {
    setFoodListings(prev => [{ 
      ...food, 
      id: Date.now(), 
      restaurantId: currentUser?.id,
      restaurant: currentUser?.name || "Your Restaurant",
      status: "Available", 
      distance: "0 km" 
    }, ...prev]);
    setStats(prev => ({ ...prev, restaurants: prev.restaurants + 1 }));
  };

  // Volunteer accepts pickup
  const acceptPickup = (foodId) => {
    setFoodListings(prev => prev.map(f => f.id === foodId ? { ...f, status: "Assigned" } : f));
    const food = foodListings.find(f => f.id === foodId);
    if (food) {
      setDeliveries(prev => [{
        id: Date.now(),
        foodId: food.id,
        food: food.name,
        quantity: food.quantity,
        restaurantId: food.restaurantId,
        restaurant: food.restaurant,
        volunteerId: currentUser?.id,
        volunteer: currentUser?.name || "Volunteer",
        eta: "15 min",
        status: "In Transit"
      }, ...prev]);
    }
  };

  // Shelter confirms delivery
  const confirmDelivery = (deliveryId) => {
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, status: "Delivered" } : d));
    
    // Also mark the original food listing as delivered so hotel can see it
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setFoodListings(prev => prev.map(f => f.id === delivery.foodId ? { ...f, status: "Delivered" } : f));
    }

    setStats(prev => ({ 
      ...prev, 
      mealsSaved: prev.mealsSaved + Math.floor(Math.random() * 20) + 10,
      wasteReduced: Number((prev.wasteReduced + 0.1).toFixed(1))
    }));
  };

  // Volunteer reaches destination
  const markAsReached = (deliveryId) => {
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, status: "Reached Shelter" } : d));
  };

  return (
    <GlobalContext.Provider value={{ 
      currentUser, login, register, logout, 
      foodListings, deliveries, shelters, stats, 
      postFood, acceptPickup, confirmDelivery, markAsReached 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

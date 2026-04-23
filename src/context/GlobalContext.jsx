import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, clearToken, getToken, setToken } from "../lib/api";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [foodListings, setFoodListings] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [stats, setStats] = useState({ mealsSaved: 0, restaurants: 0, volunteers: 0, wasteReduced: 0 });

  const refreshAll = async () => {
    const [food, dels, sh, st] = await Promise.all([
      apiFetch("/api/food-listings"),
      apiFetch("/api/deliveries"),
      apiFetch("/api/shelters"),
      apiFetch("/api/stats"),
    ]);
    setFoodListings(food || []);
    setDeliveries(dels || []);
    setShelters(sh || []);
    setStats(st || { mealsSaved: 0, restaurants: 0, volunteers: 0, wasteReduced: 0 });
  };

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) setAuthReady(true);
        return;
      }

      try {
        const me = await apiFetch("/api/me", { auth: true });
        if (!cancelled) setCurrentUser(me);
      } catch {
        // Token invalid/expired
        clearToken();
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Load app data even if not logged in
    refreshAll().catch(() => {
      // ignore; backend may not be running yet
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (name, email, password, role) => {
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { name, email, password, role },
      });

      setToken(res.token);
      setCurrentUser(res.user);
      await refreshAll();
      return { success: true };
    } catch (e) {
      return { error: e.message || "Registration failed" };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setToken(res.token);
      setCurrentUser(res.user);
      await refreshAll();
      return { success: true };
    } catch (e) {
      return { error: e.message || "Login failed" };
    }
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
  };

  const postFood = async (food) => {
    try {
      const listing = await apiFetch("/api/food-listings", {
        method: "POST",
        auth: true,
        body: food,
      });
      setFoodListings(prev => [listing, ...prev]);
    } catch {
      // ignore
    }
  };

  const acceptPickup = async (foodId) => {
    try {
      const res = await apiFetch(`/api/food-listings/${foodId}/accept`, {
        method: "POST",
        auth: true,
      });
      if (res?.listing) {
        setFoodListings(prev => prev.map(f => (f.id === res.listing.id ? res.listing : f)));
      }
      if (res?.delivery) {
        setDeliveries(prev => [res.delivery, ...prev]);
      }
    } catch {
      // ignore
    }
  };

  const confirmDelivery = async (deliveryId) => {
    try {
      const res = await apiFetch(`/api/deliveries/${deliveryId}/confirm`, {
        method: "POST",
        auth: true,
      });

      if (res?.delivery) {
        setDeliveries(prev => prev.map(d => (d.id === res.delivery.id ? res.delivery : d)));
      }
      if (res?.listing) {
        setFoodListings(prev => prev.map(f => (f.id === res.listing.id ? res.listing : f)));
      }
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch {
      // ignore
    }
  };

  const markAsReached = async (deliveryId) => {
    try {
      const delivery = await apiFetch(`/api/deliveries/${deliveryId}/reached`, {
        method: "POST",
        auth: true,
      });
      setDeliveries(prev => prev.map(d => (d.id === delivery.id ? delivery : d)));
    } catch {
      // ignore
    }
  };

  const contextValue = {
    authReady,
    currentUser,
    login,
    register,
    logout,
    foodListings,
    deliveries,
    shelters,
    stats,
    postFood,
    acceptPickup,
    confirmDelivery,
    markAsReached,
    refreshAll,
  };

  return (
    <GlobalContext.Provider value={{ 
      ...contextValue
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  db 
} from "../lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  setDoc,
  orderBy,
  serverTimestamp,
  increment
} from "firebase/firestore";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [foodListings, setFoodListings] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [stats, setStats] = useState({ mealsSaved: 0, restaurants: 0, volunteers: 0, wasteReduced: 0 });

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data (role) from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data(), id: user.uid });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Data Listeners
  useEffect(() => {
    // Food Listings
    const qFood = query(collection(db, "foodListings"), orderBy("createdAt", "desc"));
    const unsubFood = onSnapshot(qFood, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFoodListings(data);
    });

    // Shelters
    const unsubShelters = onSnapshot(collection(db, "shelters"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShelters(data);
    });

    // Stats
    const unsubStats = onSnapshot(doc(db, "app", "stats"), (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.data());
      }
    });

    return () => {
      unsubFood();
      unsubShelters();
      unsubStats();
    };
  }, []);

  // 3. Specific Deliveries Listener (filtered for current user if volunteer)
  useEffect(() => {
    if (!currentUser) {
      setDeliveries([]);
      return;
    }

    let qDels;
    if (currentUser.role === "volunteer") {
      qDels = query(collection(db, "deliveries"), where("volunteerId", "==", currentUser.id));
    } else if (currentUser.role === "restaurant") {
      qDels = query(collection(db, "deliveries"), where("restaurantId", "==", currentUser.id));
    } else {
      qDels = query(collection(db, "deliveries"), where("shelterId", "==", currentUser.id));
    }

    const unsubDels = onSnapshot(qDels, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(data);
    });

    return () => unsubDels();
  }, [currentUser]);

  // Actions
  const register = async (name, email, password, role) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      
      await updateProfile(user, { displayName: name });
      
      // Store additional info in Firestore
      const userData = { name, email, role, createdAt: serverTimestamp() };
      await setDoc(doc(db, "users", user.uid), userData);
      
      setCurrentUser({ ...user, ...userData, id: user.uid });
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  };

  const loginWithGoogle = async (role = "volunteer") => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // If new user, save their role and info
        const userData = { 
          name: user.displayName, 
          email: user.email, 
          role: role, 
          createdAt: serverTimestamp() 
        };
        await setDoc(doc(db, "users", user.uid), userData);
        setCurrentUser({ ...user, ...userData, id: user.uid });
      }
      
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  };

  const logout = () => signOut(auth);

  const postFood = async (food) => {
    try {
      await addDoc(collection(db, "foodListings"), {
        ...food,
        restaurantId: currentUser.id,
        restaurant: currentUser.name,
        status: "Available",
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error posting food:", e);
    }
  };

  const acceptPickup = async (foodId) => {
    try {
      const foodRef = doc(db, "foodListings", foodId);
      const foodSnap = await getDoc(foodRef);
      const foodData = foodSnap.data();

      // Update food status
      await updateDoc(foodRef, { status: "In Transit" });

      // Create delivery record
      await addDoc(collection(db, "deliveries"), {
        foodId,
        food: foodData.name,
        restaurantId: foodData.restaurantId,
        restaurant: foodData.restaurant,
        volunteerId: currentUser.id,
        volunteer: currentUser.name,
        status: "Picked Up",
        acceptedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error accepting pickup:", e);
    }
  };

  const confirmDelivery = async (deliveryId) => {
    try {
      const deliveryRef = doc(db, "deliveries", deliveryId);
      const deliverySnap = await getDoc(deliveryRef);
      const delData = deliverySnap.data();

      // Update delivery
      await updateDoc(deliveryRef, { 
        status: "Delivered", 
        deliveredAt: serverTimestamp() 
      });

      // Update original food listing
      await updateDoc(doc(db, "foodListings", delData.foodId), { status: "Delivered" });

      // Update global stats
      const statsRef = doc(db, "app", "stats");
      await updateDoc(statsRef, {
        mealsSaved: increment(1),
        wasteReduced: increment(0.5) // Example value
      });
    } catch (e) {
      console.error("Error confirming delivery:", e);
    }
  };

  const contextValue = {
    authReady,
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    foodListings,
    deliveries,
    shelters,
    stats,
    postFood,
    acceptPickup,
    confirmDelivery,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

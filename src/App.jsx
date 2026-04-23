import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Restaurants } from "./pages/Restaurants";
import { Volunteers } from "./pages/Volunteers";
import { Shelters } from "./pages/Shelters";
import { Impact, MapPage } from "./pages/ImpactAndMap";

// Route Guards
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, authReady } = useGlobalContext();
  if (!authReady) return null;
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (allowedRole && currentUser.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

// Extracted inner App tree to consume context for logic if needed
function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/impact" element={<Impact />} />
          
          {/* Protected Dashboards */}
          <Route path="/restaurants" element={<ProtectedRoute allowedRole="restaurant"><Restaurants /></ProtectedRoute>} />
          <Route path="/volunteers" element={<ProtectedRoute allowedRole="volunteer"><Volunteers /></ProtectedRoute>} />
          <Route path="/shelters" element={<ProtectedRoute allowedRole="shelter"><Shelters /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute allowedRole="volunteer"><MapPage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;

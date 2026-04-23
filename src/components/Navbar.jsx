import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Zap } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  let links = [];
  if (!currentUser) {
    links = [
      { name: "Home", path: "/" },
      { name: "Impact report", path: "/impact" }
    ];
  } else if (currentUser.role === "restaurant") {
    links = [
      { name: "Inventory", path: "/restaurants" },
      { name: "Impact report", path: "/impact" }
    ];
  } else if (currentUser.role === "volunteer") {
    links = [
      { name: "Route Map", path: "/map" },
      { name: "Operations", path: "/volunteers" },
      { name: "Impact", path: "/impact" }
    ];
  } else if (currentUser.role === "shelter") {
    links = [
      { name: "Manifest", path: "/shelters" }
    ];
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-neutral-900">Food<span className="text-primary">Bridge</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === l.path ? "text-primary bg-primary/5" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!currentUser ? (
              <Link to="/auth" className="btn-primary !py-2.5 !px-6 text-sm">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mb-1">Authenticated</div>
                  <div className="font-bold text-neutral-900 text-sm leading-none">{currentUser.name}</div>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2.5 rounded-xl bg-neutral-100 text-neutral-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-1 pt-2 animate-fade-in">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-4 rounded-2xl text-base font-bold ${location.pathname === l.path ? "bg-primary/5 text-primary" : "text-neutral-600 active:bg-neutral-50"}`}
              >
                {l.name}
              </Link>
            ))}
            {!currentUser ? (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="mt-4 mx-2 btn-primary">
                Login
              </Link>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-4 mx-2 px-4 py-4 rounded-2xl text-base font-bold text-red-500 bg-red-50 border border-red-100 flex items-center justify-center gap-2">
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

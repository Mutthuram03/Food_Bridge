import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
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
      { name: "Impact Report", path: "/impact" }
    ];
  } else if (currentUser.role === "restaurant") {
    links = [
      { name: "Inventory", path: "/restaurants" },
      { name: "Impact Report", path: "/impact" }
    ];
  } else if (currentUser.role === "volunteer") {
    links = [
      { name: "Route Map", path: "/map" },
      { name: "Active Operations", path: "/volunteers" },
      { name: "Impact Report", path: "/impact" }
    ];
  } else if (currentUser.role === "shelter") {
    links = [
      { name: "Shipment Manifest", path: "/shelters" }
    ];
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-white font-black text-lg md:text-xl leading-none">F</span>
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">Food<span className="text-slate-500">Bridge</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === l.path ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <Link to="/auth" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-sm flex items-center gap-2">
                <User size={16} /> Secure Portal
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-xs text-right hidden lg:block">
                  <div className="text-slate-500 font-bold uppercase tracking-wider">Active Session</div>
                  <div className="font-black text-slate-900">{currentUser.name}</div>
                </div>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 border border-slate-200" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 border-t border-slate-100 pt-2 bg-slate-50 rounded-b-xl px-2">
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path} 
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3.5 rounded-xl text-sm font-bold ${location.pathname === l.path ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600"}`}
              >
                {l.name}
              </Link>
            ))}
            {!currentUser ? (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="mx-2 mt-3 px-4 py-3.5 text-sm font-bold text-center text-white bg-slate-900 rounded-xl shadow-md border border-black">
                Secure Portal
              </Link>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mx-2 mt-3 px-4 py-3 text-sm font-bold text-center text-red-600 bg-red-50 rounded-xl flex items-center justify-center gap-2 border border-red-100">
                <LogOut size={18} /> Terminate Session
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

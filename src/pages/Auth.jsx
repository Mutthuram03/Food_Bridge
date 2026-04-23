import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { AlertCircle } from "lucide-react";

export function Auth() {
  const { login, register } = useGlobalContext();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "volunteer" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Please fill in all fields.");
    }

    if (isRegister) {
      if (!form.name) return setError("Organization or Full Name is required.");
      const res = await register(form.name, form.email, form.password, form.role);
      if (res.error) return setError(res.error);
    } else {
      const res = await login(form.email, form.password);
      if (res.error) return setError(res.error);
    }

    // Success - redirect home
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <span className="text-white font-bold text-3xl leading-none">F</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            {isRegister ? "Create Account" : "Platform Access"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isRegister ? "Register your enterprise logistics profile." : "Enter your credentials to securely authenticate."}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name / Org Name</label>
              <input
                type="text"
                placeholder="e.g. Spice Garden Hotel"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="you@organization.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Organizational Role</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-slate-50 focus:bg-white cursor-pointer"
              >
                <option value="restaurant">Corporate / Culinary (Restaurant/Hotel)</option>
                <option value="volunteer">Logistics Fleet (Volunteer Hero)</option>
                <option value="shelter">NGO / Shelter</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-4 mt-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md">
            {isRegister ? "Secure Registration" : "Authenticate"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          {isRegister ? "Already an authorized partner? " : "Not part of the network? "}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-indigo-600 font-bold hover:underline"
          >
            {isRegister ? "Log in here" : "Apply for access"}
          </button>
        </div>
      </div>
    </div>
  );
}

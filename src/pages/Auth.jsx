import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { AlertCircle, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export function Auth() {
  const { login, register, loginWithGoogle } = useGlobalContext();
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

    navigate("/");
  };

  const handleGoogleLogin = async () => {
    const res = await loginWithGoogle(form.role);
    if (res.error) return setError(res.error);
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full glass-card p-10 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 rotate-3">
             <Zap size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
            {isRegister ? "Join the Network" : "Secure Portal Access"}
          </h1>
          <p className="text-neutral-500 text-sm font-medium">
            {isRegister ? "Start your organizational journey with FoodBridge." : "Authenticate to access your dashboard."}
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-600 text-sm font-bold px-4 py-4 rounded-xl flex items-center gap-3 animate-fade-in">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Entity Name</label>
              <input
                type="text"
                placeholder="e.g. Green Kitchen Org"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-100/50 hover:bg-neutral-100"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@organization.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-100/50 hover:bg-neutral-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-100/50 hover:bg-neutral-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Organizational Intent</label>
            <select
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer hover:bg-neutral-50"
            >
              <option value="restaurant">Culinary Entity (Restaurant/Hotel)</option>
              <option value="volunteer">Logistics Partner (Volunteer)</option>
              <option value="shelter">Social Impact Hub (NGO/Shelter)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-6 flex justify-between items-center group">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              {isRegister ? "Complete Onboarding" : "Authenticate Session"}
            </span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-4 text-neutral-400">Or continue with</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-2xl border border-neutral-200 flex items-center justify-center gap-3 font-bold text-neutral-700 hover:bg-neutral-50 transition-all active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google Enterprise
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
          <p className="text-neutral-500 text-sm font-medium">
            {isRegister ? "Already part of the network?" : "New to the platform?"}
          </p>
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="mt-2 text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            {isRegister ? "Back to Login" : "Initialize New Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

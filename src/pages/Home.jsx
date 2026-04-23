import React from "react";
import { Link } from "react-router-dom";
import { ExpiryBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";
import { Heart, Truck, Utensils, ShieldCheck } from "lucide-react";

function HeroSection() {
  const { foodListings } = useGlobalContext();
  return (
    <section className="relative overflow-hidden bg-neutral-50 pt-24 pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-24 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-600 text-[11px] uppercase font-bold tracking-[0.2em] px-5 py-2.5 rounded-full mb-10 shadow-sm">
            <ShieldCheck size={14} className="text-primary" />
            <span>Enterprise Food Logistics Network</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-neutral-900 leading-[1.05] mb-8 tracking-tight">
            Connecting Surplus <br />
            <span className="text-primary italic">to Sustainability</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            FoodBridge is the premium infrastructure for corporate food recovery. 
            Bridging the gap between fine dining and community need through real-time logistics.
          </p>
          
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/restaurants" className="btn-primary group">
              Start Donation
              <Truck size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/volunteers" className="btn-secondary group">
              Join the Fleet
            </Link>
          </div>
        </div>

        {/* Feature Cards / Floating Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {foodListings.slice(0, 3).map((item, i) => (
            <div 
              key={item.id} 
              className="glass-card card-hover p-6 animate-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-3xl overflow-hidden shadow-inner">
                    {item.image && item.image.length > 10 ? 
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} /> : 
                      (item.image || "🍱")
                    }
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
                    <Heart size={12} className="text-red-500 fill-red-500" />
                  </div>
                </div>
                <ExpiryBadge expiryMs={item.expiryMs} />
              </div>
              
              <h3 className="font-bold text-neutral-900 mb-1">{item.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{item.restaurant}</p>
              
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "70%" }} />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                <span>Priority</span>
                <span className="text-primary">High</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { stats } = useGlobalContext();
  const displayStats = [
    { value: stats.mealsSaved.toLocaleString(), label: "Meals Reallocated", icon: <Utensils className="text-emerald-600" /> },
    { value: stats.restaurants.toLocaleString(), label: "Partner Kitchens", icon: <Heart className="text-rose-500" /> },
    { value: stats.volunteers.toLocaleString(), label: "Active Fleet", icon: <Truck className="text-blue-500" /> },
    { value: `${stats.wasteReduced}t`, label: "CO2 Reduction", icon: <ShieldCheck className="text-amber-500" /> },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((s, i) => (
            <div key={s.label} className="group p-8 rounded-3xl border border-neutral-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="text-4xl font-bold text-neutral-900 mb-2 tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-[0.1em]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 bg-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-500 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
          Ready to scale <br />
          <span className="text-primary">your social impact?</span>
        </h2>
        <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Join hundreds of leading culinary establishments already using FoodBridge 
          to reach carbon neutrality while nourishing their communities.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="px-10 py-4 bg-white text-neutral-900 font-bold rounded-2xl shadow-2xl hover:bg-neutral-50 hover:-translate-y-1 transition-all">
            Get Started
          </button>
          <Link to="/impact" className="px-10 py-4 bg-neutral-800 text-white font-bold rounded-2xl border border-neutral-700 hover:bg-neutral-700 hover:-translate-y-1 transition-all">
            View Logistics Map
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <HeroSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}

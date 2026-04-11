import React from "react";
import { Link } from "react-router-dom";
import { ExpiryBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";

function HeroSection() {
  const { foodListings } = useGlobalContext();
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-slate-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-indigo-50 rounded-full opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-50 rounded-full opacity-50 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full mb-8 border border-slate-200 shadow-sm">
            <span>Corporate Food Recovery Network</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Streamline Surplus.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Empower Communities.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            FoodBridge provides enterprise logistics for surplus food reallocation. Connecting trusted culinary establishments directly to verified NGOs through our volunteer fleet.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/restaurants" className="group px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-200 transition-all hover:-translate-y-1 flex items-center gap-2">
              Initiate Transfer <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
            <Link to="/volunteers" className="group px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-1 flex items-center gap-2">
              Join Logistics Fleet
            </Link>
          </div>
        </div>

        {/* Floating food cards */}
        <div className="mt-20 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {foodListings.slice(0, 3).map((item, i) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-100/50 border border-slate-100 transition-transform" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center text-3xl overflow-hidden shadow-inner flex-shrink-0">
                  {item.image && item.image.length > 10 ? <img src={item.image} className="w-full h-full object-cover" alt="food" /> : (item.image || "🍱")}
                </div>
                <div className="font-bold text-slate-900 text-sm truncate">{item.name}</div>
                <div className="text-xs text-slate-500 mt-1">{item.restaurant}</div>
                <div className="mt-4"><ExpiryBadge expiryMs={item.expiryMs} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { stats } = useGlobalContext();
  const displayStats = [
    { value: stats.mealsSaved.toLocaleString(), label: "Meals Reallocated", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-900" },
    { value: stats.restaurants.toLocaleString(), label: "Partner Kitchens", bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-900" },
    { value: stats.volunteers.toLocaleString(), label: "Active Fleet", bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-900" },
    { value: `${stats.wasteReduced} tons`, label: "CO2 Equivalent Saved", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900" },
  ];
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Measurable Impact</h2>
          <p className="text-slate-500 text-base">Metrics validated across our partnered supply chain.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map(s => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-8 text-center transition-transform hover:-translate-y-1`}>
              <div className={`text-3xl sm:text-4xl font-black ${s.text} mb-2 tracking-tight`}>{s.value}</div>
              <div className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">Deploy Impact Today.</h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
          Integrate your surplus management with FoodBridge's secure routing network. Eliminate waste overhead while feeding your community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-white text-slate-900 font-bold text-sm rounded-xl shadow-xl hover:bg-slate-50 transition-colors">Register Enterprise</button>
          <Link to="/impact" className="px-8 py-4 bg-transparent text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all">
            Review Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <HeroSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}

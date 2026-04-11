import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { ShieldCheck, BarChart4, ChevronRight } from "lucide-react";

export function MapPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-lg border border-slate-200">
        <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🗺️</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Live Map Integration Active</h2>
        <p className="text-slate-500 mb-8 font-medium">The interactive Leaflet routing map is now integrated directly into the Logistics Fleet dashboard when an order is accepted.</p>
        <Link to="/volunteers" className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
          Access Logistics Fleet <ChevronRight size={20} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}

export function Impact() {
  const { stats } = useGlobalContext();
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-6 shadow-md shadow-slate-200">
            <BarChart4 size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise KPI Report</h1>
          <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">Real-time metrics measuring the scale, efficiency, and ecological impact of FoodBridge's routing operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-500"/> Verified</div>
              <div className="text-5xl font-black text-slate-900 mb-2">{stats.mealsSaved.toLocaleString()}</div>
              <div className="text-slate-500 font-medium pb-6 border-b border-slate-100">Total units of surplus relocated efficiently to affiliated NGO shelters.</div>
              <div className="mt-6 flex items-center gap-4">
                 <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-slate-900 h-full w-[85%] rounded-full"/></div>
                 <div className="text-xs font-bold text-slate-900">+12% MoM</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500"/> Verified</div>
              <div className="text-5xl font-black text-slate-900 mb-2">{stats.wasteReduced} <span className="text-2xl text-slate-400">t</span></div>
              <div className="text-slate-500 font-medium pb-6 border-b border-slate-100">Estimated tons of CO2 carbon equivalents negated through our operations.</div>
              <div className="mt-6 flex items-center gap-4">
                 <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[65%] rounded-full"/></div>
                 <div className="text-xs font-bold text-slate-900">+5% MoM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

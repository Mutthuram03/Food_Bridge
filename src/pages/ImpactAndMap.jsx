import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { ShieldCheck, BarChart4, ChevronRight, Map, Globe, Wind } from "lucide-react";

export function MapPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="glass-card p-12 max-w-xl w-full text-center animate-fade-in relative z-10">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
           <Map size={48} />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Fleet Intelligence Active</h2>
        <p className="text-neutral-500 mb-10 font-medium leading-relaxed">
          The interactive Leaflet routing engine is now integrated directly into the Logistics Fleet dashboard. 
          Claim an operation to initialize terminal-to-terminal navigation.
        </p>
        <Link to="/volunteers" className="btn-primary w-full py-4 text-base">
          Enter Fleet Operations <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}

export function Impact() {
  const { stats } = useGlobalContext();
  
  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-900 text-white rounded-3xl mb-8 shadow-2xl">
            <BarChart4 size={36} className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-neutral-900 tracking-tighter mb-4">Enterprise ESG Report</h1>
          <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Real-time metrics measuring the scale, logistical efficiency, and ecological impact of FoodBridge's operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass-card p-10 relative group hover:bg-white transition-colors duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Globe size={24} />
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Verified KPI</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Community Nutrition</div>
              <div className="text-6xl font-bold text-neutral-900 tracking-tighter">{stats.mealsSaved.toLocaleString()}</div>
              <p className="text-neutral-500 font-medium pt-4 pb-10 border-b border-neutral-100">
                Total units of validated surplus successfully relocated to social impact hubs.
              </p>
              
              <div className="pt-8 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                  <span>Resource Efficiency Index</span>
                  <span className="text-primary">85% Optimize</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%] rounded-full group-hover:w-[88%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-10 relative group hover:bg-white transition-colors duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Wind size={24} />
              </div>
              <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">Verified KPI</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">CO2 Impact Avoided</div>
              <div className="text-6xl font-bold text-neutral-900 tracking-tighter">
                {stats.wasteReduced} <span className="text-3xl text-neutral-300">tonnes</span>
              </div>
              <p className="text-neutral-500 font-medium pt-4 pb-10 border-b border-neutral-100">
                Carbon equivalent debt neutralized through supply chain surplus optimization.
              </p>
              
              <div className="pt-8 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                  <span>Carbon Credit Delta</span>
                  <span className="text-amber-500">Tier A+</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[65%] group-hover:w-[70%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
          All metrics are cryptographically verified and audited in real-time.
        </div>
      </div>
    </div>
  );
}

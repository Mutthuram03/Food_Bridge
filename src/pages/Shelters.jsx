import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { StatusBadge } from "../components/ui/Badges";
import { Home, CheckCircle, Package, TrendingUp, Users, ClipboardList } from "lucide-react";

export function Shelters() {
  const { shelters, deliveries, confirmDelivery } = useGlobalContext();
  const [confirmedIds, setConfirmedIds] = useState([]);

  const handleConfirm = (id) => {
    confirmDelivery(id);
    setConfirmedIds(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="bg-white border-b border-neutral-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
              <Home size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Social Impact Hubs</h1>
              <p className="text-neutral-500 font-medium flex items-center gap-2">
                <ClipboardList size={16} /> Incoming Manifest Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {shelters.map(s => (
            <div key={s.id} className="glass-card p-8 card-hover">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="font-bold text-xl text-neutral-900 tracking-tight mb-1">{s.name}</div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{s.address}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 transition-colors hover:bg-neutral-100/50">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Users size={12} /> Occupancy
                  </div>
                  <div className="font-bold text-2xl text-neutral-900 tracking-tighter">
                    {s.currentOccupancy}<span className="text-neutral-300 font-medium text-lg">/{s.capacity}</span>
                  </div>
                </div>
                <div className="bg-primary/[0.03] rounded-2xl p-5 border border-primary/10 transition-colors hover:bg-primary/[0.05]">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Impact
                  </div>
                  <div className="font-bold text-2xl text-primary tracking-tighter">{s.meals} Units</div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  <span>Capacity Index</span>
                  <span>{Math.round((s.currentOccupancy / s.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden shadow-inner">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(s.currentOccupancy / s.capacity) * 100}%` }} 
                  />
                </div>
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em] pt-2">Admin Contact: {s.contact}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Package size={20} className="text-primary" /> Incoming Allocation Manifest
          </h2>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="text-center py-24 glass-card border-dashed">
            <ClipboardList className="mx-auto mb-4 text-neutral-300" size={48} />
            <p className="text-neutral-500 font-bold">No transports currently synchronized.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {deliveries.map(d => (
              <div key={d.id} className="glass-card card-hover p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                  <div className="font-bold text-neutral-900 truncate pr-4 text-lg tracking-tight">{d.food}</div>
                  <StatusBadge status={d.status} />
                </div>
                
                <div className="space-y-5 mb-10 flex-1">
                  <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                    <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Package size={20} className="text-primary" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Quantity Recv</span>
                      <span className="font-bold text-neutral-900 leading-none">{d.quantity} units</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Origin Point</span>
                      <span className="text-xs font-bold text-neutral-700">{d.restaurant}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Courier Fleet</span>
                      <span className="text-xs font-bold text-neutral-700">{d.volunteer}</span>
                    </div>
                    {d.status !== "Delivered" && d.status !== "Reached Shelter" && (
                       <div className="flex items-center justify-between pt-2 border-t border-neutral-50">
                         <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Logistics ETA</span>
                         <span className="font-bold text-primary text-base tracking-tighter">{d.eta}</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-50">
                  {d.status === "Delivered" || confirmedIds.includes(d.id) ? (
                    <div className="btn-primary !bg-emerald-50 !text-emerald-700 !border-emerald-200 !shadow-none !rounded-2xl cursor-default">
                      <CheckCircle size={18} /> Allocation Validated
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConfirm(d.id)}
                      disabled={d.status !== "Reached Shelter"}
                      className="btn-primary w-full py-4 !rounded-2xl disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:shadow-none"
                    >
                      {d.status === "Reached Shelter" ? "Authorize Terminal Receipt" : "Awaiting Site Arrival"}
                    </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

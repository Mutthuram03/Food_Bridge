import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { StatusBadge } from "../components/ui/Badges";
import { Home, CheckCircle } from "lucide-react";

export function Shelters() {
  const { shelters, deliveries, confirmDelivery } = useGlobalContext();
  const [confirmedIds, setConfirmedIds] = useState([]);

  const handleConfirm = (id) => {
    confirmDelivery(id);
    setConfirmedIds(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shadow-sm border border-sky-100">
              <Home size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Shelter Logistics</h1>
              <p className="text-slate-500 text-sm">Monitor incoming allocations and finalize receipts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {shelters.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-black text-xl text-slate-900 mb-1">{s.name}</div>
                  <div className="text-xs font-medium text-slate-500">{s.address}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity</div>
                  <div className="font-black text-2xl text-slate-900">{s.currentOccupancy}<span className="text-slate-400 font-medium text-lg">/{s.capacity}</span></div>
                </div>
                <div className="bg-sky-50 rounded-xl p-4 text-center border border-sky-100">
                  <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-1">Meals Recv'd</div>
                  <div className="font-black text-2xl text-sky-700">{s.meals}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-slate-600 font-medium">Admin: {s.contact}</div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Occupancy Index</span>
                    <span>{Math.round((s.currentOccupancy / s.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${(s.currentOccupancy / s.capacity) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-black text-slate-900 mb-6">Incoming Allocation Manifest</h2>
        {deliveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <Home className="mx-auto mb-4 opacity-50" size={32} />
            <p>No transports scheduled at this time.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveries.map(d => (
              <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
                  <div className="font-bold text-slate-900 truncate pr-4 text-base">{d.food}</div>
                  <StatusBadge status={d.status} />
                </div>
                
                <div className="flex flex-col gap-3 text-sm font-medium text-slate-600 mb-8 flex-1">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-lg">📦</span> <span className="font-bold text-slate-900">{d.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-1 border-b border-dashed border-slate-100 pb-2 pt-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Source</span>
                    <span className="text-slate-700">{d.restaurant}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-1 border-b border-dashed border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Courier</span>
                    <span className="text-slate-700">{d.volunteer}</span>
                  </div>
                  {d.status !== "Delivered" && d.status !== "Reached Shelter" && (
                     <div className="flex items-center justify-between text-xs px-1 text-indigo-600 pt-2 pb-1">
                       <span className="text-indigo-400 font-bold uppercase tracking-wider">ETA</span>
                       <span className="font-black text-base">{d.eta}</span>
                     </div>
                  )}
                </div>

                <div className="mt-auto">
                  {d.status === "Delivered" || confirmedIds.includes(d.id) ? (
                    <div className="w-full py-3 text-sm font-bold rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2 border border-emerald-200">
                      <CheckCircle size={18} /> Receipt Confirmed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConfirm(d.id)}
                      disabled={d.status !== "Reached Shelter"}
                      className="w-full py-3.5 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white shadow-sm transition-all text-center"
                    >
                      {d.status === "Reached Shelter" ? "Sign & Confirm Receipt" : "Awaiting Arrival"}
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

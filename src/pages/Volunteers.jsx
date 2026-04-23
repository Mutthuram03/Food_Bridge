import React, { useState } from "react";
import { ExpiryBadge, StatusBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";
import { Truck, Navigation, CheckCircle, MapPin, Store, Zap, ShieldCheck } from "lucide-react";
import clsx from "clsx";

function RealMap({ lat, lng, restaurantLocation }) {
  if (!lat || !lng) {
    lat = 12.9716; 
    lng = 77.5946; 
  }
  
  const bbox = `${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="h-80 w-full rounded-2xl overflow-hidden shadow-inner mt-6 border border-neutral-200 relative z-0">
      <iframe 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        scrolling="no" 
        marginHeight="0" 
        marginWidth="0" 
        src={embedUrl}
        className="w-full h-full pointer-events-auto filter saturate-150 contrast-125"
      ></iframe>
      <div className="absolute top-4 right-4 glass-card px-4 py-2 border-primary/20 flex items-center gap-2 animate-fade-in">
        <MapPin size={14} className="text-primary"/> 
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-800">{restaurantLocation} Hub</span>
      </div>
    </div>
  );
}

export function Volunteers() {
  const { currentUser, foodListings, deliveries, acceptPickup, markAsReached } = useGlobalContext();
  const available = foodListings.filter(f => f.status === "Available");
  const [activeTasks, setActiveTasks] = useState([]);

  const handleAccept = (id) => {
    acceptPickup(id);
    setActiveTasks(prev => [...prev, id]);
  };

  const handleReached = (foodId) => {
    const delivery = deliveries.find(d => d.foodId === foodId);
    if (delivery) {
      markAsReached(delivery.id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="bg-white border-b border-neutral-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
              <Truck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{currentUser?.name}</h1>
              <p className="text-neutral-500 font-medium flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> Active Operations Personnel
              </p>
            </div>
          </div>
          <div className="px-5 py-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-600">
            {available.length} Operations in Proximity
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Navigation size={20} className="text-primary" /> Active Logistics Radar
              </h2>
            </div>

            {foodListings.length === 0 ? (
              <div className="text-center py-24 glass-card border-dashed">
                <Truck className="mx-auto mb-4 text-neutral-300" size={48} />
                <p className="text-neutral-500 font-bold">Radar clear. No pending operations.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {foodListings.map(item => {
                  const isAcceptedByMe = activeTasks.includes(item.id);
                  const delivery = deliveries.find(d => d.foodId === item.id);
                  const isReached = delivery?.status === "Reached Shelter";

                  return (
                    <div 
                      key={item.id} 
                      className={clsx(
                        "glass-card card-hover p-8 relative overflow-hidden animate-fade-in", 
                        isAcceptedByMe && "border-primary/30 ring-2 ring-primary/5"
                      )}
                    >
                      {isAcceptedByMe && (
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />
                      )}
                      
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="flex items-start gap-5 flex-1">
                          <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-inner border border-neutral-100 overflow-hidden">
                            {item.image && item.image.length > 10 ? <img src={item.image} className="w-full h-full object-cover" alt="food" /> : (item.image || "🍱")}
                          </div>
                          <div className="space-y-1">
                             <div className="font-bold text-neutral-900 text-xl tracking-tight">{item.name}</div>
                             <div className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                                <Store size={14} className="text-neutral-400"/> {item.restaurant}
                             </div>
                             <div className="flex flex-wrap gap-2 pt-2">
                                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-neutral-200">BOXES: {item.quantity}</span>
                                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-neutral-200 flex items-center gap-1.5"><MapPin size={12}/>{item.distance}</span>
                             </div>
                          </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-3">
                           <StatusBadge status={item.status} />
                           {item.status === "Available" && <ExpiryBadge expiryMs={item.expiryMs} />}
                        </div>
                      </div>

                      {isAcceptedByMe ? (
                         <div className="mt-8 pt-8 border-t border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                               <div className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                                 <Navigation size={18} className="text-primary"/> Route In Progress
                               </div>
                               <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Authorized Agent: You</div>
                            </div>
                            <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest ml-1 mb-2">Transit Destination</div>
                            <div className="text-sm font-bold text-neutral-600 ml-1">{item.location} (Synchronized window: {item.pickupTime})</div>
                            
                            <RealMap lat={item.lat} lng={item.lng} restaurantLocation={item.restaurant} />
                            
                            <div className="mt-8">
                               {isReached || item.status === "Delivered" ? (
                                  <div className="btn-primary !bg-emerald-50 !text-emerald-700 !border-emerald-200 !shadow-none cursor-default">
                                    <CheckCircle size={18}/> Hub Connection Established
                                  </div>
                               ) : (
                                  <button onClick={() => handleReached(item.id)} className="btn-primary w-full py-4 !rounded-2xl">
                                    <MapPin size={18}/> Confirm Arrival at Impact Hub
                                  </button>
                                )}
                            </div>
                         </div>
                      ) : (
                         <div className="mt-6">
                           {item.status === "Available" ? (
                              <button
                                onClick={() => handleAccept(item.id)}
                                className="btn-primary w-full py-4 !rounded-2xl"
                              >
                                Accept Logistics Mission
                              </button>
                            ) : (
                              <button disabled className="btn-secondary w-full py-4 !rounded-2xl opacity-50 cursor-not-allowed">
                                Mission Claimed by Partner
                              </button>
                            )}
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="glass-card bg-neutral-900 border-none p-8 text-white shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Agent Profile</h3>
                  <p className="text-neutral-500 text-xs mt-1 font-bold uppercase tracking-widest">Fleet Integrity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="text-3xl font-bold mb-1 tracking-tighter">42</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Missions</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="text-3xl font-bold mb-1 tracking-tighter">9.2</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Trust Index</div>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Fuel Efficiency</span>
                  <span className="text-xs font-bold text-primary">A+</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

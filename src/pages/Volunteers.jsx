import React, { useState } from "react";
import { ExpiryBadge, StatusBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";
import { Bike, Navigation, CheckCircle, MapPin, Store } from "lucide-react";
import clsx from "clsx";

function RealMap({ lat, lng, restaurantLocation }) {
  // Safe fallbacks for rendering
  if (!lat || !lng) {
    lat = 12.9716; 
    lng = 77.5946; 
  }
  
  // Calculate a small bounding box around the location for OpenStreetMap Embed
  const bbox = `${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="h-72 w-full rounded-2xl overflow-hidden shadow-inner mt-4 border border-slate-200 relative z-0">
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
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur text-[11px] uppercase tracking-wider font-bold text-white px-4 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 transition-all hover:bg-slate-800">
        <MapPin size={14} className="text-indigo-400"/> {restaurantLocation || "Pickup"}
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
    // Find delivery ID associated with this food
    const delivery = deliveries.find(d => d.foodId === foodId);
    if (delivery) {
      markAsReached(delivery.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Bike size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{currentUser?.name}</h1>
              <p className="text-slate-500 text-sm">Locate pickups and deliver impact</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm">
            {available.length} Local Pickups Active
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Navigation size={18} className="text-indigo-600" /> Active Radar
            </h2>

            {foodListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <Bike className="mx-auto mb-3 opacity-40" size={32} />
                <p>No food pickups available at the moment.<br/>Check back later!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {foodListings.map(item => {
                  const isAcceptedByMe = activeTasks.includes(item.id);
                  const delivery = deliveries.find(d => d.foodId === item.id);
                  const isReached = delivery?.status === "Reached Shelter";

                  return (
                    <div key={item.id} className={clsx("bg-white rounded-2xl p-6 shadow-sm border relative overflow-hidden transition-all", isAcceptedByMe ? "border-indigo-200 ring-2 ring-indigo-50" : "border-slate-200 hover:shadow-md")}>
                      {isAcceptedByMe && (
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-600" />
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner overflow-hidden">
                            {item.image && item.image.length > 10 ? <img src={item.image} className="w-full h-full object-cover" alt="food" /> : (item.image || "🍱")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-slate-900 text-lg leading-tight mb-1">{item.name}</div>
                            <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                               <Store size={14}/> {item.restaurant}
                            </div>
                            <div className="flex gap-2">
                               <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">📦 {item.quantity}</span>
                               <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1"><MapPin size={12}/>{item.distance}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                          <StatusBadge status={item.status} />
                          {item.status === "Available" && <ExpiryBadge expiryMs={item.expiryMs} />}
                        </div>
                      </div>

                      {isAcceptedByMe ? (
                         <div className="mt-6 border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                                 <Navigation size={18} className="text-indigo-500"/> Route Active
                               </div>
                               <div className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-100">Assigned: You</div>
                            </div>
                            <div className="text-xs text-slate-500 font-medium mb-4">{item.location} (pickup by {item.pickupTime})</div>
                            
                            {/* Unbreakable Embedded Map */}
                            <RealMap lat={item.lat} lng={item.lng} restaurantLocation={item.restaurant} />
                            
                            <div className="mt-5 flex gap-3">
                               {isReached || item.status === "Delivered" ? (
                                  <div className="flex-1 py-3 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex justify-center items-center gap-2 transition-all">
                                    <CheckCircle size={18}/> Reached Destination
                                  </div>
                               ) : (
                                  <button onClick={() => handleReached(item.id)} className="flex-1 py-3 text-sm font-bold bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                                    <MapPin size={16}/> I Have Reached
                                  </button>
                               )}
                            </div>
                         </div>
                      ) : (
                         <div className="mt-4">
                           {item.status === "Available" ? (
                              <button
                                onClick={() => handleAccept(item.id)}
                                className="w-full py-3.5 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 text-white transition-all flex items-center justify-center gap-2"
                              >
                                Accept Pickup
                              </button>
                            ) : (
                              <button disabled className="w-full py-3 text-sm font-bold rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                                Assigned to Another Hero
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

          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6 sticky top-24">
              <h3 className="font-black text-lg mb-1">Performance</h3>
              <p className="text-slate-400 text-sm mb-6">Your real-time metrics.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-black mb-1">32</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliveries</div>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-black mb-1">4.8</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

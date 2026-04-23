import React, { useState } from "react";
import { ExpiryBadge, StatusBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";
import { Store, Loader2, CheckCircle, Navigation, UploadCloud, PlusCircle, ClipboardCheck, History } from "lucide-react";

export function Restaurants() {
  const { currentUser, foodListings, postFood, deliveries } = useGlobalContext();
  const [form, setForm] = useState({ name: "", type: "", quantity: "", pickupTime: "", expiryTime: "", location: "", notes: "", image: "🍱" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const myPickups = foodListings.filter(f => f.restaurantId === currentUser?.id);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({ ...p, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.location) return;
    
    setLoading(true);
    setTimeout(() => {
      postFood({
        name: form.name,
        type: form.type || "Other",
        quantity: form.quantity,
        pickupTime: form.pickupTime || "ASAP",
        expiryMs: Date.now() + 3600000 * 2,
        location: form.location,
        image: form.image
      });
      setForm({ name: "", type: "", quantity: "", pickupTime: "", expiryTime: "", location: "", notes: "", image: "🍱" });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="bg-white border-b border-neutral-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
              <Store size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{currentUser?.name}</h1>
              <p className="text-neutral-500 font-medium flex items-center gap-2">
                <ClipboardCheck size={16} /> Corporate Logistics Hub
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-5 py-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-600">
               {myPickups.length} Active Contributions
             </div>
             <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-emerald-200 hover:scale-105 transition-transform md:hidden">
               <PlusCircle />
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Submission Form */}
          <div className="lg:col-span-5">
            <div className="glass-card p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-neutral-900">Surplus Manifest</h2>
                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">New Entry</div>
              </div>
              
              {submitted && (
                <div className="mb-6 bg-primary/10 border border-primary/20 text-primary text-sm font-bold px-4 py-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <CheckCircle size={20} /> Manifest synchronized successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Inventory Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gourmet Assortment"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Metric/Quantity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25 Units"
                      value={form.quantity}
                      onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Pickup Window</label>
                    <input
                      type="time"
                      value={form.pickupTime}
                      onChange={e => setForm(p => ({ ...p, pickupTime: e.target.value }))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-50 focus:bg-white cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Dispatch Point</label>
                    <input
                      type="text"
                      required
                      placeholder="Street, City"
                      value={form.location}
                      onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Inventory Proof</label>
                  <label className="relative flex flex-col items-center justify-center py-10 px-4 mt-2 border-2 border-dashed border-neutral-200 hover:border-primary hover:bg-primary/[0.02] rounded-3xl cursor-pointer group transition-all">
                    {form.image && form.image.length > 10 ? (
                       <div className="absolute inset-2 overflow-hidden rounded-2xl">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity" />
                       </div>
                    ) : (
                       <UploadCloud size={32} className="text-neutral-300 group-hover:text-primary transition-colors mb-3" />
                    )}
                    <span className="text-sm font-bold text-neutral-400 group-hover:text-primary relative z-10 transition-colors uppercase tracking-widest">Select Visual</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-3">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                  Record & Dispatch
                </button>
              </form>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <History size={20} className="text-primary" /> Active Logistics Log
              </h2>
            </div>
            
            {myPickups.length === 0 ? (
              <div className="text-center py-24 glass-card border-dashed">
                <ClipboardCheck className="mx-auto mb-4 text-neutral-300" size={48} />
                <p className="text-neutral-500 font-bold">No operational history found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {myPickups.map(item => {
                  const trackData = deliveries.find(d => d.foodId === item.id);
                  const isReached = trackData?.status === "Reached Shelter";
                  
                  return (
                    <div key={item.id} className="glass-card card-hover p-8 animate-fade-in">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 pb-6 border-b border-neutral-100">
                         <div className="flex items-start gap-5">
                            <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center text-4xl overflow-hidden shadow-inner border border-neutral-100 flex-shrink-0">
                              {item.image && item.image.length > 10 ? <img src={item.image} className="w-full h-full object-cover" alt="food" /> : (item.image || "🍱")}
                            </div>
                            <div className="space-y-1">
                               <div className="font-bold text-neutral-900 text-xl tracking-tight">{item.name}</div>
                               <div className="text-sm font-medium text-neutral-400">{item.location}</div>
                               <div className="inline-flex bg-neutral-100 text-neutral-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-neutral-200">
                                 Unit Capacity: {item.quantity}
                               </div>
                            </div>
                         </div>
                         <div className="flex sm:flex-col items-center sm:items-end gap-3 self-stretch sm:self-auto">
                            <StatusBadge status={item.status} />
                            {item.status === "Available" && <ExpiryBadge expiryMs={item.expiryMs} />}
                         </div>
                      </div>

                      {/* Status Specific UI */}
                      {item.status === "Assigned" && trackData && !isReached && (
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm border border-primary/10"><Navigation size={22}/></div>
                               <div>
                                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Fleet Deployment</div>
                                  <div className="text-sm font-bold text-neutral-900">Partner <span className="text-primary">{trackData.volunteer}</span> engaged</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Transit ETA</div>
                               <div className="text-2xl font-bold text-primary tracking-tighter">{trackData.eta}</div>
                            </div>
                        </div>
                      )}

                      {isReached && item.status !== "Delivered" && (
                         <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white text-amber-500 rounded-xl flex items-center justify-center shadow-sm border border-amber-200"><Navigation size={22}/></div>
                            <div>
                               <div className="text-sm font-bold text-neutral-900">On-Site: Social Impact Hub</div>
                               <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-0.5">Awaiting shelter sign-off</div>
                            </div>
                        </div>
                      )}

                      {item.status === "Delivered" && (
                        <div className="bg-emerald-50 border border-emerald-200/50 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white text-emerald-500 rounded-xl flex items-center justify-center shadow-sm border border-emerald-200"><CheckCircle size={22}/></div>
                            <div>
                               <div className="text-sm font-bold text-neutral-900">Archive: Reallocated</div>
                               <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Community nutrition impact validated</div>
                            </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

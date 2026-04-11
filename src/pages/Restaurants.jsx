import React, { useState } from "react";
import { ExpiryBadge, StatusBadge } from "../components/ui/Badges";
import { useGlobalContext } from "../context/GlobalContext";
import { Store, Loader2, CheckCircle, ImagePlus, Navigation, UploadCloud } from "lucide-react";

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
        image: form.image // Pass base64 or emoji
      });
      setForm({ name: "", type: "", quantity: "", pickupTime: "", expiryTime: "", location: "", notes: "", image: "🍱" });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{currentUser?.name}</h1>
              <p className="text-slate-500 text-sm">Corporate Food Recovery Portal</p>
            </div>
          </div>
          <div className="text-sm font-bold bg-white text-slate-700 px-5 py-2.5 border border-slate-200 rounded-xl shadow-sm">
             {myPickups.length} Active Contributions 
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">📝 Submit Surplus Log</h2>
              
              {submitted && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle size={18} /> Documentation recorded successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Inventory Name *", placeholder: "e.g. Assorted Bread", type: "text", required: true, span: 2 },
                    { key: "quantity", label: "Quantity *", placeholder: "e.g. 50 lbs", type: "text", required: true, span: 1 },
                    { key: "pickupTime", label: "Pickup Time", placeholder: "", type: "time", span: 1 },
                    { key: "location", label: "Dispatch Location *", placeholder: "Branch Address", type: "text", required: true, span: 2 },
                  ].map(f => (
                    <div key={f.key} className={f.span === 2 ? "col-span-2" : "col-span-1"}>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
                      <input
                        type={f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Inventory Photo</label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 rounded-xl p-8 text-center text-slate-400 hover:text-indigo-600 text-sm cursor-pointer transition-all flex flex-col items-center gap-3 relative overflow-hidden group">
                    {form.image && form.image.length > 10 ? (
                       <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    ) : (
                       <UploadCloud size={28} />
                    )}
                    <span className="relative z-10 font-medium">Capture or upload photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Record & Broadcast"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-lg font-black text-slate-900 mb-6">Log Interface</h2>
            {myPickups.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Store className="mx-auto mb-4 opacity-50" size={32} />
                <p>No active inventory logs generated.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {myPickups.map(item => {
                  const trackData = deliveries.find(d => d.foodId === item.id);
                  const isReached = trackData?.status === "Reached Shelter";
                  
                  return (
                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-5 transition-shadow hover:shadow-md">
                      
                      <div className="flex sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                         <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-4xl overflow-hidden shadow-inner flex-shrink-0">
                              {item.image && item.image.length > 10 ? <img src={item.image} className="w-full h-full object-cover" alt="food" /> : (item.image || "🍱")}
                            </div>
                            <div>
                               <div className="font-black text-slate-900 text-lg mb-1">{item.name}</div>
                               <div className="text-xs font-medium text-slate-500 mb-2">{item.location}</div>
                               <div className="inline-flex bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">📦 {item.quantity}</div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={item.status} />
                            {item.status === "Available" && <ExpiryBadge expiryMs={item.expiryMs} />}
                         </div>
                      </div>

                      {item.status === "Assigned" && trackData && !isReached && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center"><Navigation size={18}/></div>
                               <div>
                                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Dispatched</div>
                                  <div className="text-sm font-bold text-slate-900">{trackData.volunteer} deployed</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">ETA</div>
                               <div className="text-lg font-black text-indigo-700">{trackData.eta}</div>
                            </div>
                        </div>
                      )}

                      {isReached && item.status !== "Delivered" && (
                         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-lg flex items-center justify-center"><Navigation size={18}/></div>
                            <div>
                               <div className="text-sm font-bold text-slate-900">Volunteer Arrived at Shelter</div>
                               <div className="text-xs font-medium text-yellow-800">Awaiting confirmation from Shelter admin.</div>
                            </div>
                        </div>
                      )}

                      {item.status === "Delivered" && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><CheckCircle size={18}/></div>
                            <div>
                               <div className="text-sm font-bold text-slate-900">Delivery Concluded</div>
                               <div className="text-xs font-medium text-emerald-700">Audit complete. Nutrition successfully re-allocated.</div>
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

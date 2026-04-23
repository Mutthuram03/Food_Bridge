import React from "react";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-500 py-20 px-6 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-white">Food<span className="text-primary">Bridge</span></span>
            </div>
            <p className="text-neutral-400 max-w-sm font-medium leading-relaxed">
              Global infrastructure for surplus food recovery and reallocation. 
              Pioneering logistics for a zero-waste future.
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-8">
            <div className="flex flex-wrap gap-8 font-bold text-sm tracking-widest uppercase">
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">Logistics API</a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">Fleet Status</a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors">Privacy Council</a>
            </div>
            
            <div className="pt-8 border-t border-neutral-800 w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-neutral-600 uppercase tracking-widest">
              <span>© 2024 FOODBRIDGE ENTEPRISE CO.</span>
              <span className="flex items-center gap-2">
                OPERATIONAL <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

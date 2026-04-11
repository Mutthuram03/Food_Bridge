import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-black text-xl text-white">Food<span className="text-green-400">Bridge</span></span>
          </div>
          <p className="text-sm text-center">Built with ❤️ to reduce food waste. Connecting communities since 2024.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

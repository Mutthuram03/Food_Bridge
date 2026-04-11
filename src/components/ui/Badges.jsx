import React from 'react';
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export function ExpiryBadge({ expiryMs }) {
  const timeLeft = Math.max(0, expiryMs - Date.now());
  const hoursLeft = Math.floor(timeLeft / 3600000);
  const isUrgent = hoursLeft < 2;

  return (
    <div className={clsx(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
      isUrgent 
        ? "bg-red-50 text-red-600 border-red-100" 
        : "bg-slate-50 text-slate-600 border-slate-200"
    )}>
      {isUrgent ? <AlertCircle size={14} /> : <Clock size={14} />}
      {hoursLeft > 0 ? `Expires in ${hoursLeft}h` : "Expiring soon"}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    "Available": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Assigned": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "In Transit": "bg-blue-50 text-blue-700 border-blue-100",
    "Reached Shelter": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Delivered": "bg-slate-50 text-slate-500 border-slate-200 grayscale",
  };

  const currentStyle = styles[status] || styles["Available"];

  return (
    <div className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm", currentStyle)}>
      {status === "Available" ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : <CheckCircle2 size={14} />}
      {status}
    </div>
  );
}

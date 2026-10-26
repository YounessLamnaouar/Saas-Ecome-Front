import i18n from "@/i18n";
import { T } from '@/context/Preferences';
import React from "react";
import { Check, Clock, PackageCheck, Truck, ShieldCheck } from "lucide-react";

const STEPS = [
  { key: "en_attente", label: "Pending", desc: "Order received", icon: Clock },
  { key: "confirmee", label: "Confirmed", desc: "Preparing your package", icon: ShieldCheck },
  { key: "en_cours_de_livraison", label: "Out for delivery", desc: "Package on its way", icon: Truck },
  { key: "livre", label: "Delivered", desc: "Package delivered", icon: PackageCheck },
];

const STATUS_RANKS = {
  en_attente: 1,
  confirmee: 2,
  en_cours_de_livraison: 3,
  livre: 4,
};

export default function OrderStatusStepper({ currentStatus, histories = [] }) {
  const currentRank = STATUS_RANKS[currentStatus] || 1;

  // Create lookup for histories timestamps
  const historyMap = {};
  histories.forEach((h) => {
    historyMap[h.status] = h.created_at;
  });

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
        {STEPS.map((step, idx) => {
          const stepRank = STATUS_RANKS[step.key];
          const isCompleted = stepRank < currentRank;
          const isCurrent = stepRank === currentRank;
          const isPending = stepRank > currentRank;
          const timestamp = historyMap[step.key];
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex sm:flex-col items-center sm:text-center relative">
              {/* Connector line for desktop */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-5 start-1/2 w-full h-1 -z-0 transition-colors ${
                    stepRank < currentRank ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Step circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white shadow-sm"
                    : isCurrent
                    ? "bg-amber-500 border-amber-500 text-white shadow-md ring-4 ring-amber-100"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={18} /> : <Icon size={18} />}
              </div>

              {/* Text info */}
              <div className="ms-4 sm:ms-0 sm:mt-3 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    isCurrent ? "text-amber-700" : isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <T>{step.label}</T>
                </p>
                <p className="text-xs text-gray-500 hidden sm:block"><T>{step.desc}</T></p>
                {timestamp && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(timestamp).toLocaleDateString(i18n.resolvedLanguage, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

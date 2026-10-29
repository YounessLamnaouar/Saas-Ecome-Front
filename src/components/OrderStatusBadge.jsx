import { T } from '@/context/Preferences';
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Truck, PackageCheck } from "lucide-react";

export const ORDER_STATUS_MAP = {
 cancelled: { label: "Cancelled", icon: Clock, colorClass: "bg-red-100 text-red-800 border-red-200", dotClass: "bg-red-500" },
  en_attente: {
    label: "Pending",
    labelEn: "Pending",
    variant: "warning",
    icon: Clock,
    colorClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  confirmee: {
    label: "Confirmed",
    labelEn: "Confirmed",
    variant: "secondary",
    icon: CheckCircle2,
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  en_cours_de_livraison: {
    label: "Out for delivery",
    labelEn: "Out for delivery",
    variant: "default",
    icon: Truck,
    colorClass: "bg-purple-100 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
  },
  livre: {
    label: "Delivered",
    labelEn: "Delivered",
    variant: "success",
    icon: PackageCheck,
    colorClass: "bg-green-100 text-green-800 border-green-200",
    dotClass: "bg-green-500",
  },
};

export default function OrderStatusBadge({ status, showIcon = false, className = "" }) {
  const config = ORDER_STATUS_MAP[status] || {
    label: status,
    variant: "outline",
    icon: Clock,
    colorClass: "bg-gray-100 text-gray-800 border-gray-200",
    dotClass: "bg-gray-400",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.colorClass} ${className}`}
    >
      {showIcon && <Icon size={12} className="shrink-0" />}
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span><T>{config.label}</T></span>
    </span>
  );
}

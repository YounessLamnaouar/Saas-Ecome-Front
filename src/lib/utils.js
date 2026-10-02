import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui className combiner.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

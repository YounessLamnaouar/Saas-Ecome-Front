import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboardService";
export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats, staleTime: 15000, refetchInterval: 30000, refetchOnWindowFocus: true });
}

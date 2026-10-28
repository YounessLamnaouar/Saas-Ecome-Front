import { apiClient } from "@/lib/apiClient";
export async function getDashboardStats() {
  const { data } = await apiClient.get('/admin/stats');
  return data;
}

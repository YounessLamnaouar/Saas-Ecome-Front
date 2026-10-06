import { apiClient } from "@/lib/apiClient";

export async function createOrder(orderPayload) {
  const { data } = await apiClient.post("/orders", orderPayload);
  return data;
}

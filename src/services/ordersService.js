import { apiClient } from "@/lib/apiClient";

export async function createOrder(orderPayload) {
  const { data } = await apiClient.post("/orders", orderPayload);
  return data;
}

export async function trackOrder({ code, phone }) {
  const { data } = await apiClient.get("/orders/track", {
    params: { code, phone },
  });
  return data;
}

export async function getMyOrders() {
  const { data } = await apiClient.get("/my-orders");
  return data || [];
}

export async function getMyOrder(code) {
  const { data } = await apiClient.get(`/my-orders/${code}`);
  return data;
}

export async function listAdminOrders({ page = 1, perPage = 10, status, search } = {}) {
  const { data, meta } = await apiClient.get("/admin/orders", {
    params: { page, per_page: perPage, status: status || undefined, search: search || undefined },
  });
  return { orders: data || [], meta };
}

export async function getAdminOrder(id) {
  const { data } = await apiClient.get(`/admin/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await apiClient.patch(`/admin/orders/${id}/status`, { status });
  return data;
}

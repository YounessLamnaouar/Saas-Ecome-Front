import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersService from "@/services/ordersService";

export function useTrackOrder({ code, phone }, { enabled = true } = {}) {
  return useQuery({
    queryKey: ["track-order", code, phone],
    queryFn: () => ordersService.trackOrder({ code, phone }),
    enabled: Boolean(code && phone && enabled),
    retry: false,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: ordersService.getMyOrders,
  });
}

export function useMyOrder(code) {
  return useQuery({
    queryKey: ["my-order", code],
    queryFn: () => ordersService.getMyOrder(code),
    enabled: Boolean(code),
  });
}

export function useAdminOrders(params) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => ordersService.listAdminOrders(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminOrder(id) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => ordersService.getAdminOrder(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => ordersService.updateOrderStatus(id, status),
    onSuccess: (data, { id }) => {
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      qc.invalidateQueries({ queryKey: ["track-order"] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
}

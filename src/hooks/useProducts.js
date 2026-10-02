import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productsService from "@/services/productsService";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.listProducts(params),
    placeholderData: (prev) => prev, // keep old page visible while the next page loads
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getProduct(id),
    enabled: id !== undefined && id !== null,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => productsService.updateProduct(id, patch),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", String(id)] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

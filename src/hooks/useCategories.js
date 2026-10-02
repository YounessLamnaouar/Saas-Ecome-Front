import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoriesService from "@/services/categoriesService";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: categoriesService.listCategories });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, patch }) => categoriesService.updateCategory(slug, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesService.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

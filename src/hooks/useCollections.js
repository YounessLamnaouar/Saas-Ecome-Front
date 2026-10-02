import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as collectionsService from "@/services/collectionsService";

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: collectionsService.listCollections,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: collectionsService.createCollection,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collections"] }),
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, patch }) => collectionsService.updateCollection(slug, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collections"] }),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: collectionsService.deleteCollection,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collections"] }),
  });
}

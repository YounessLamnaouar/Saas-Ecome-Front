import { apiClient } from "@/lib/apiClient";

export async function listCollections() {
  const { data } = await apiClient.get("/collections");
  return data || [];
}

export async function getCollection(slug) {
  const { data } = await apiClient.get(`/collections/${slug}`);
  return data;
}

export async function createCollection(collection) {
  const { data } = await apiClient.post("/collections", collection);
  return data;
}

export async function updateCollection(slug, patch) {
  const { data } = await apiClient.put(`/collections/${slug}`, patch);
  return data;
}

export async function deleteCollection(slug) {
  await apiClient.delete(`/collections/${slug}`);
}

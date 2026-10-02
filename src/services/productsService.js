import { apiClient } from "@/lib/apiClient";
import { normalizeProduct, denormalizeProduct } from "@/services/adapters/fakeapi.adapter";

/**
 * Product data-access layer connected directly to the Laravel REST API.
 */

export async function listProducts({ page = 1, perPage = 12, category, search, sortBy, sortDir } = {}) {
  const { data, meta } = await apiClient.get("/products", {
    params: { page, per_page: perPage, category, search, sort_by: sortBy, sort_dir: sortDir },
  });
  const products = (data || []).map(normalizeProduct);
  return { products, meta: meta || { page, per_page: perPage, total: products.length, total_pages: 1 } };
}

export async function getProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return normalizeProduct(data);
}

export async function createProduct(product) {
  const { data } = await apiClient.post("/products", denormalizeProduct(product));
  return normalizeProduct(data);
}

export async function updateProduct(id, patch) {
  const { data } = await apiClient.put(`/products/${id}`, denormalizeProduct(patch));
  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
}

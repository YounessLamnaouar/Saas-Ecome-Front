import { apiClient } from "@/lib/apiClient";
import { normalizeProduct, denormalizeProduct } from "@/services/adapters/fakeapi.adapter";

/**
 * Product data-access layer connected directly to the Laravel REST API.
 */

export async function listProducts({ page = 1, perPage = 12, category, collection, search, sortBy, sortDir } = {}) {
  const { data, meta } = await apiClient.get("/products", {
    params: { page, per_page: perPage, category, collection, search, sort_by: sortBy, sort_dir: sortDir },
  });
  const products = (data || []).map(normalizeProduct);

  const normalizedMeta = meta
    ? {
        page: meta.current_page || meta.page || page,
        current_page: meta.current_page || meta.page || page,
        total_pages: meta.last_page || meta.total_pages || 1,
        last_page: meta.last_page || meta.total_pages || 1,
        per_page: meta.per_page || perPage,
        total: meta.total ?? products.length,
      }
    : { page, current_page: page, total_pages: 1, last_page: 1, per_page: perPage, total: products.length };

  return { products, meta: normalizedMeta };
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

import { apiClient } from "@/lib/apiClient";
import { normalizeCategory } from "@/services/adapters/fakeapi.adapter";

export async function listCategories() {
  const { data } = await apiClient.get("/categories", { params: { per_page: 100 } });
  return (data || []).map(normalizeCategory);
}

export async function getCategory(slug) {
  const { data } = await apiClient.get(`/categories/${slug}`);
  return normalizeCategory(data);
}

export async function createCategory(category) {
  const { data } = await apiClient.post("/categories", {
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
  });
  return normalizeCategory(data);
}

export async function updateCategory(slug, patch) {
  const { data } = await apiClient.put(`/categories/${slug}`, {
    name: patch.name,
    slug: patch.slug,
    description: patch.description,
    image: patch.image,
  });
  return normalizeCategory(data);
}

export async function deleteCategory(slug) {
  await apiClient.delete(`/categories/${slug}`);
}

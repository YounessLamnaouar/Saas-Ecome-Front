import { apiClient } from "@/lib/apiClient";
import { normalizeProduct, normalizeCategory } from "@/services/adapters/fakeapi.adapter";

const LOW_STOCK_THRESHOLD = 20;
// The fake API has no /stats endpoint, so KPIs are computed client-side from
// one page of products (the API's max page size). category counts and total
// product count come straight from /categories, which the API aggregates
// server-side, so those two numbers are exact; everything else is a sample
// and labelled as such in the UI. Once the Laravel API exists, replace this
// with a single GET /admin/stats endpoint that returns real aggregates.
const SAMPLE_SIZE = 100;

export async function getDashboardStats() {
  const [{ data: rawCategories }, { data: rawProducts }] = await Promise.all([
    apiClient.get("/categories", { params: { per_page: 100 } }),
    apiClient.get("/products", { params: { per_page: SAMPLE_SIZE, sort_by: "created_at", sort_dir: "desc" } }),
  ]);

  const categories = rawCategories.map(normalizeCategory);
  const products = rawProducts.map(normalizeProduct);

  const totalProducts = categories.reduce((sum, c) => sum + c.productsCount, 0);
  const tagCounts = new Map();
  products.forEach((p) => p.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)));

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  const outOfStock = products.filter((p) => p.stock === 0 || p.availability === "out_of_stock").length;
  const avgRating = products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0;
  const inventoryValueSample = products.reduce((s, p) => s + p.price * p.stock, 0);

  return {
    totalProducts,
    totalCategories: categories.length,
    totalCollections: tagCounts.size,
    sampleSize: products.length,
    lowStock,
    outOfStock,
    avgRating,
    inventoryValueSample,
    productsPerCategory: categories
      .map((c) => ({ name: c.name, count: c.productsCount }))
      .sort((a, b) => b.count - a.count),
    topTags: [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
  };
}

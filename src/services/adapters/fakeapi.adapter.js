/**
 * Adapter: fakeapi.dev product/category shape -> the app's canonical shape.
 *
 * This is the ONLY file that knows what fakeapi.dev's JSON looks like.
 * Every component in the app (storefront + admin) works with the canonical
 * shape below, never with raw API fields. When the Laravel API is built,
 * either make it return this same shape (recommended — then this file
 * becomes a 1:1 pass-through) or write one more adapter next to this one
 * and swap it in productsService.js / categoriesService.js.
 *
 * Canonical Product:
 *   { id, name, slug, description, price, oldPrice, discountPercent,
 *     image, images[], category, categoryName, brand, sku, rating, stock,
 *     availability, tags[], colors[], createdAt }
 *
 * Canonical Category:
 *   { id, name, slug, image, description, productsCount }
 */

export function normalizeProduct(p) {
  const hasDiscount = p.discount_percentage > 0 && p.discounted_price < p.price;
  return {
    id: p.id,
    name: p.title,
    slug: p.sku,
    description: p.description || "",
    price: hasDiscount ? p.discounted_price : p.price,
    oldPrice: hasDiscount ? p.price : null,
    discountPercent: hasDiscount ? p.discount_percentage : 0,
    image: p.thumbnail,
    images: p.images || [],
    category: p.category?.slug || "uncategorized",
    categoryName: p.category?.name || "Uncategorized",
    brand: p.brand || "",
    sku: p.sku || "",
    rating: Math.round(p.rating || 0),
    stock: p.stock ?? 0,
    availability: p.availability || (p.stock > 0 ? "in_stock" : "out_of_stock"),
    tags: p.tags || [],
    colors: [], // fakeapi has no color variants; storefront hides the picker when empty
    createdAt: p.created_at,
  };
}

export function normalizeCategory(c) {
  return {
    id: c.slug,
    name: c.name,
    slug: c.slug,
    image: c.image,
    description: c.description || "",
    productsCount: c.products_count ?? 0,
  };
}

// Reverse direction: canonical -> the payload the Laravel API will expect
// on create/update. Kept here so the admin forms never build raw payloads.
export function denormalizeProduct(product) {
  return {
    title: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    sku: product.sku,
    stock: product.stock,
    category_slug: product.category,
    tags: product.tags,
    thumbnail: product.image,
  };
}

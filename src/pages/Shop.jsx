import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { T, usePreferences } from '@/context/Preferences';
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const SORT_OPTIONS = {
  default: {},
  "price-asc": { sortBy: "price", sortDir: "asc" },
  "price-desc": { sortBy: "price", sortDir: "desc" },
  name: { sortBy: "title", sortDir: "asc" },
};

export default function Shop() {
  const { t, language } = usePreferences();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const collectionParam = searchParams.get("collection") || "";
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, collectionParam, activeCategory, sort]);

  const { data: categories } = useCategories();
  const { data, isLoading, isFetching } = useProducts({
    page,
    perPage: 12,
    search: search || undefined,
    collection: collectionParam || undefined,
    category: activeCategory === "all" ? undefined : activeCategory,
    ...SORT_OPTIONS[sort],
  });

  const products = data?.products || [];
  const meta = data?.meta;

  const pageTitle = collectionParam
    ? `Collection: ${collectionParam}`
    : search
    ? `Search results for "${search}"`
    : "Shop All Products";

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
            <T>{pageTitle}</T>
          </h1>
          <p className="text-gray-600"><T>{meta ? `${meta.total} products found` : "Loading…"}</T></p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"}`}
            > <T>All</T> </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === cat.id ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Select value={sort} onValueChange={setSort} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <SelectTrigger aria-label={t('Sort by')} className="w-full md:w-52 shrink-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('Sort by')}</SelectItem>
              <SelectItem value="price-asc">{t('Price: Low to High')}</SelectItem>
              <SelectItem value="price-desc">{t('Price: High to Low')}</SelectItem>
              <SelectItem value="name">{t('Name: A-Z')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg"> <T>No products found matching your selection.</T> </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isFetching ? "opacity-60" : ""}`}>
              {products.map((product, i) => (
                <ProductCard i={i} key={product.id} product={product} />
              ))}
            </div>

            {meta && meta.total_pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium disabled:opacity-40 cursor-pointer"
                > <T>Previous</T> </button>
                <span className="text-sm text-gray-500"> <T>Page</T> {meta.page} <T>of</T> {meta.total_pages}</span>
                <button
                  disabled={page >= meta.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium disabled:opacity-40 cursor-pointer"
                > <T>Next</T> </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

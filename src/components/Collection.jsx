import { T } from '@/context/Preferences';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import set from "../assets/set.png";
import dress from "../assets/dress.png";
import women_Handbags from "../assets/Women_Handbags.png";
import hat from "../assets/hat.png";
import red_shoes from "../assets/red_shoes.png";

const FALLBACK_IMAGES = [set, dress, women_Handbags, hat, red_shoes];

const ITEMS_PER_PAGE = 6;

export default function Collection() {
  const { data: collections, isLoading } = useCollections();
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10"> <T>Shop by</T> <span className="text-gray-600"> <T>Collection</T> </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = collections || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900"> <T>Shop by</T> <span className="text-gray-600"> <T>Collection</T> </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1"> <T>Discover curated fashion trends and handpicked seasonal styles.</T> </p>
          </div>
          {items.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm w-fit">
              {items.length} <T>Collections Total</T> </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 py-16 text-center"> <T>No collections available right now.</T> </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((col, index) => {
                const imageSrc = col.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                const count = col.products_count ?? col.products?.length ?? 0;

                return (
                  <Link
                    key={col.id || col.slug}
                    to={`/shop?collection=${encodeURIComponent(col.slug)}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <div className="relative flex h-48 items-center justify-center bg-muted p-6 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                        }}
                        className="h-full w-full object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
                      />
                      {col.is_featured && (
                        <span className="absolute top-3 end-3 flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1 text-xs font-medium text-card-foreground">
                          <Sparkles size={12} aria-hidden="true" /> <T>Featured</T>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 text-start">
                      <h3 className="text-xl font-bold capitalize break-words">{col.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {col.description || <T>Curated product collection</T>}
                      </p>
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                          <span className="text-xs text-muted-foreground">{count} <T>Products</T></span>
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            <T>Shop now</T><ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium disabled:opacity-40 cursor-pointer flex items-center gap-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={16} className="rtl:rotate-180" /> <T>Previous</T> </button>
                <span className="text-sm text-gray-600 font-semibold"> <T>Page</T> {page} <T>of</T> {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium disabled:opacity-40 cursor-pointer flex items-center gap-1 hover:bg-gray-100 transition-colors"
                > <T>Next</T> <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

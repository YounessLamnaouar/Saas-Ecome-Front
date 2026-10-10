import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Package } from "lucide-react";
import set from "../assets/set.png";
import dress from "../assets/dress.png";
import women_Handbags from "../assets/Women_Handbags.png";
import hat from "../assets/hat.png";
import red_shoes from "../assets/red_shoes.png";

const FALLBACK_IMAGES = [set, dress, women_Handbags, hat, red_shoes];

const COLOR_TINTS = [
  "bg-amber-50/70 border-amber-100 hover:border-amber-300 text-amber-950",
  "bg-blue-50/70 border-blue-100 hover:border-blue-300 text-blue-950",
  "bg-pink-50/70 border-pink-100 hover:border-pink-300 text-pink-950",
  "bg-purple-50/70 border-purple-100 hover:border-purple-300 text-purple-950",
  "bg-emerald-50/70 border-emerald-100 hover:border-emerald-300 text-emerald-950",
  "bg-rose-50/70 border-rose-100 hover:border-rose-300 text-rose-950",
];

const ITEMS_PER_PAGE = 6;

export default function Collection() {
  const { data: collections, isLoading } = useCollections();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10">
            Shop by <span className="text-gray-600">Collection</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
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
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Shop by <span className="text-gray-600">Collection</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Discover curated fashion trends and handpicked seasonal styles.</p>
          </div>
          {items.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm w-fit">
              {items.length} Collections Total
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">No collections available right now.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((col, index) => {
                const colorScheme = COLOR_TINTS[index % COLOR_TINTS.length];
                const imageSrc = col.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                const count = col.products_count ?? col.products?.length ?? 0;

                return (
                  <div
                    key={col.id || col.slug}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onClick={() => navigate(`/shop?collection=${col.slug}`)}
                    className={`${colorScheme} rounded-2xl p-6 shadow-md hover:shadow-2xl border transition-all duration-300 relative flex flex-col justify-between group hover:scale-[1.02] transform cursor-pointer overflow-hidden min-h-[220px]`}
                  >
                    {col.is_featured && (
                      <span className="absolute top-4 right-4 z-10 bg-amber-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}

                    <div className="z-10 relative">
                      <h3 className="text-2xl font-bold capitalize text-gray-900 group-hover:text-amber-700 transition-colors">
                        {col.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-50">
                        {col.description || "Curated product collection"}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-900">
                        <span>{count} Products</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-amber-600" />
                      </div>
                    </div>

                    <div className="absolute pointer-events-none bottom-0 right-0 w-36 h-25 flex justify-center items-center p-4">
                    <img
                      src={imageSrc}
                      alt={col.name}
                      className="object-contain rounded-2xl opacity-90 transition-all duration-500 group-hover:scale-110"
                    />
                    </div>

                  </div>
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
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-600 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium disabled:opacity-40 cursor-pointer flex items-center gap-1 hover:bg-gray-100 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

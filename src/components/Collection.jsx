import React from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";
import set from "../assets/set.png";
import dress from "../assets/dress.png";
import women_Handbags from "../assets/Women_Handbags.png";
import hat from "../assets/hat.png";
import red_shoes from "../assets/red_shoes.png";

const FALLBACK_IMAGES = [set, dress, women_Handbags, hat, red_shoes];

const COLOR_SCHEMES = [
  "bg-amber-100 text-amber-950",
  "bg-blue-100 text-blue-950",
  "bg-pink-100 text-pink-950",
  "bg-purple-100 text-purple-950",
  "bg-emerald-100 text-emerald-950",
  "bg-red-100 text-red-950",
];

export default function Collection() {
  const { data: collections, isLoading } = useCollections();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10">
            Shop by <span className="text-gray-600">Collection</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = collections || [];

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10">
          Shop by <span className="text-gray-600">Collection</span>
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((col, index) => {
              const colorClass = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
              const imageSrc = col.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const count = col.products_count ?? col.products?.length ?? 0;

              return (
                <div
                  key={col.id || col.slug}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => navigate(`/shop?collection=${col.slug}`)}
                  className={`${colorClass} rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between group hover:scale-105 transform cursor-pointer overflow-hidden min-h-[200px]`}
                >
                  <div className="z-10 relative">
                    <h3 className="text-xl font-bold mt-1 capitalize">{col.name}</h3>
                    <p className="text-3xl font-bold mt-2">{count}</p>
                    <p className="text-sm opacity-80 font-bold">Products</p>
                  </div>
                  <img
                    src={imageSrc}
                    alt={col.name}
                    className="absolute -right-2 -bottom-4 w-44 h-44 object-contain opacity-90 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

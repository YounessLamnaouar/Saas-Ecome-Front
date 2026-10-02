import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

export default function Category() {
  const { data: categories } = useCategories();
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!activeTab && categories?.length) setActiveTab(categories[0].id);
  }, [categories, activeTab]);

  const { data, isLoading } = useProducts({ category: activeTab, perPage: 4 });
  const activeProducts = data?.products || [];

  return (
    <section className="py-20 bg-gray-50" data-aos="fade-up">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection by category and find what suits you best.
          </p>
        </div>
        <div
          className="flex flex-wrap justify-center gap-4 mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {(categories || []).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${activeTab === tab.id ? "bg-gray-900 text-white shadow-lg scale-105" : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"}`}
            >
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <img
                  src={tab.image}
                  alt={tab.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}

          {!isLoading && activeProducts.map((product, idx) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer block"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-100 p-4"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Quick view
                </span>
                <LikeButton product={product} className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 font-medium">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

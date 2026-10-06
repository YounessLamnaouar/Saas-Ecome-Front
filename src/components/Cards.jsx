import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import LikeButton from "./LikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

const PRODUCTS_PER_PAGE = 10; // 5 columns x 2 rows

export default function Cards() {
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const { data, isLoading } = useProducts({ page: currentPage, perPage: PRODUCTS_PER_PAGE });

  const currentProducts = data?.products || [];
  const totalPages = data?.meta?.total_pages || 1;

  const nextPage = () => setCurrentPage((prev) => (prev % totalPages) + 1);
  const prevPage = () => setCurrentPage((prev) => ((prev - 2 + totalPages) % totalPages) + 1);

  return (
    <section className="py-20 bg-white" data-aos="fade-up">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            All Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of fashion items
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading &&
            Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}

          {!isLoading && currentProducts.map((product, i) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col justify-between" data-aos="zoom-in" data-aos-delay={i * 100}>
              <Link to={`/product/${product.id}`} className="relative h-56 overflow-hidden bg-gray-50 block cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 p-4" />
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-coarse:translate-x-0">
                  <LikeButton product={product} className="bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer" />
                  <button
                    onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                    className="bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                  >
                    <ShoppingCart size={16} className="stroke-gray-700" />
                  </button>
                </div>
              </Link>
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 capitalize">
                    {product.categoryName || product.category}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:underline cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <span className="text-gray-900 font-bold">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-12" data-aos="fade-up" data-aos-delay="600">
          <button onClick={prevPage} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

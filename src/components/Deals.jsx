import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { RefreshCcw, ShoppingCart, Star } from "lucide-react";
import LikeButton from "./LikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

export default function Deals() {
  const { addToCart } = useCart();
  const { data, isLoading } = useProducts({ perPage: 20, sortBy: "created_at", sortDir: "desc" });
  const products = data?.products || [];

  const dealProduct = products.find((p) => p.oldPrice) || products[0];
  const featuredProducts = products.filter((p) => p.id !== dealProduct?.id).slice(0, 3);

  const [timerNumbers, setTimerNumbers] = useState(["00", "00", "00", "00"]);
  useEffect(() => {
    const targetDate = new Date("2026-12-31T23:59:59");
    const updateTimer = () => {
      const difference = targetDate - new Date();
      if (difference <= 0) return setTimerNumbers(["00", "00", "00", "00"]);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimerNumbers([days, hours, minutes, seconds].map((n) => String(n).padStart(2, "0")));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerLabels = ["Days", "Hours", "Mins", "Secs"];

  if (isLoading || !dealProduct) {
    return (
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-gray-50">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-gray-50" data-aos="fade-up">
        <div className="bg-white rounded-xl shadow p-4 md:p-6" data-aos="fade-right" data-aos-delay="200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Deal of The Day
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
              <Link to={`/product/${dealProduct.id}`} className="relative w-full sm:w-48 flex justify-center" data-aos="zoom-in" data-aos-delay="300">
                <img src={dealProduct.image} alt={dealProduct.name} className="rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-contain" />
                {dealProduct.discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{Math.round(dealProduct.discountPercent)}%
                  </span>
                )}
              </Link>

              <div className="flex-1 text-center sm:text-left" data-aos="fade-up" data-aos-delay="400">
                <Link to={`/product/${dealProduct.id}`}>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 hover:underline">
                    {dealProduct.name}
                  </h3>
                </Link>
                <div className="flex text-yellow-400 text-sm my-1 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 text-xs md:text-sm mb-3 leading-relaxed line-clamp-2">
                  {dealProduct.description}
                </p>
                <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                  <span className="text-red-500 font-bold text-xl md:text-2xl">
                    ${dealProduct.price.toFixed(2)}
                  </span>
                  {dealProduct.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${dealProduct.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <button onClick={() => addToCart(dealProduct, 1)} className="bg-gray-900 text-white px-4 md:px-5 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm hover:bg-gray-800 transition-all">
                    <ShoppingCart size={12} />
                    Add To Cart
                  </button>
                  <LikeButton product={dealProduct} className="p-2 border rounded-lg hover:bg-gray-100 transition-all" />
                  <button className="p-2 border rounded-lg hover:bg-gray-100 transition-all">
                    <RefreshCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6 pt-4 border-t border-gray-100" data-aos="fade-up" data-aos-delay="500">
                {timerNumbers.map((num, i) => (
                  <div key={i} className="text-center">
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg min-w-12 md:min-w-15">
                        <span className="text-lg md:text-2xl font-bold">
                          {num}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {timerLabels[i]}
                    </span>
                  </div>
                ))}
            </div>
        </div>
        {/* Right */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6" data-aos="fade-down" data-aos-delay="200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4" data-aos="fade-down">
              Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((p) => (
              <div key={p.id} className="text-center" data-aos="zoom-in" data-aos-delay="300">
                <Link to={`/product/${p.id}`} className="relative h-32 flex justify-center">
                  <img className="rounded-lg h-32 object-contain" src={p.image} alt={p.name} />
                </Link>
                <Link to={`/product/${p.id}`}>
                  <h3 className="text-sm font-medium mt-3 text-gray-800 hover:underline line-clamp-1">
                    {p.name}
                  </h3>
                </Link>
                <div className="flex justify-center text-yellow-400 text-xs my-1">
                  {[...Array(p.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                  ))}
                  {[...Array(5 - p.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 stroke-yellow-400 fill-none" />
                  ))}
                </div>
                <div className="flex justify-center gap-2 text-sm mb-2">
                  <span className="text-red-500 font-black">
                    ${p.price.toFixed(2)}
                  </span>
                  {p.oldPrice && (
                    <span className="text-gray-400 line-through text-xs">
                      ${p.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex justify-center gap-1">
                  <button onClick={() => addToCart(p, 1)} className="text-xs border px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1 transition-all">
                    <ShoppingCart size={12} />
                    Add
                  </button>
                  <LikeButton product={p} size={12} className="p-1 border rounded hover:bg-gray-100 transition-all" />
                  <button className="p-1 border rounded hover:bg-gray-100 transition-all">
                    <RefreshCcw size={12} />
                  </button>
                </div>
              </div>
            ) )}
          </div>
        </div>
    </div>
  )
}

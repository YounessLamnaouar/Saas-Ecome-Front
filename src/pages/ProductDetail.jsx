import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import LikeButton from "../components/LikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

const colorClasses = { black: "bg-black", blue: "bg-blue-300", brown: "bg-orange-300" };

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(undefined);

  useEffect(() => setSelectedColor(product?.colors?.[0]), [product]);
  useEffect(() => setQty(1), [id]);

  const { data: relatedData } = useProducts({ category: product?.category, perPage: 5 });
  const related = (relatedData?.products || []).filter((p) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 grid md:grid-cols-2 gap-10">
          <Skeleton className="h-96 md:h-[500px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-24 text-center min-h-screen">
        <p className="text-gray-600 text-lg mb-4">Product not found.</p>
        <Link to="/shop" className="text-gray-900 font-semibold underline cursor-pointer">
          Back to Shop
        </Link>
      </section>
    );
  }

  const maxStock = typeof product.stock === "number" ? product.stock : 999;
  const isOutOfStock = maxStock <= 0;

  const handleIncrement = () => {
    if (qty >= maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }
    setQty((q) => q + 1);
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-gray-50 rounded-2xl flex items-center justify-center h-96 md:h-[500px] relative">
            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain p-8" />
            {isOutOfStock && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2 capitalize">{product.categoryName || product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-yellow-400"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-lg">${Number(product.oldPrice).toFixed(2)}</span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-2">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full ${colorClasses[color]} border-2 cursor-pointer ${selectedColor === color ? "border-gray-900" : "border-gray-300"} transition-all`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 border rounded-lg hover:bg-gray-100 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button
                  disabled={qty >= maxStock}
                  onClick={handleIncrement}
                  className="w-9 h-9 border rounded-lg hover:bg-gray-100 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className={`text-sm ml-2 font-medium ${isOutOfStock ? "text-red-600" : "text-gray-500"}`}>
                  {isOutOfStock ? "Out of stock" : `${maxStock} available in stock`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart({ ...product, color: selectedColor }, qty)}
                disabled={isOutOfStock}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <LikeButton product={product} size={20} className="p-3 border rounded-lg hover:bg-gray-100 transition-all cursor-pointer" />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

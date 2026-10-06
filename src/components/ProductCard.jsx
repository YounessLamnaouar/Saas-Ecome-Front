import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import LikeButton from "./LikeButton";

export default function ProductCard({ product, i }) {
  const { addToCart } = useCart();
  const isOutOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    <div data-aos="zoom-in" data-aos-delay={i * 100} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer flex flex-col justify-between">
      <Link to={`/product/${product.id}`} className="block relative h-56 bg-gray-50 overflow-hidden cursor-pointer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1 capitalize">{product.categoryName || product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:underline cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-900 font-bold">${Number(product.price).toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-xs">${Number(product.oldPrice).toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex-1 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <LikeButton product={product} className="p-2 border rounded-lg hover:bg-gray-100 transition-all cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

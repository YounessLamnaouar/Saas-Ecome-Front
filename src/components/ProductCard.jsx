import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import LikeButton from "./LikeButton";

export default function ProductCard({ product, i }) {
  const { addToCart } = useCart();

  return (
    <div data-aos="zoom-in" data-aos-delay={i * 100} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
      <Link to={`/product/${product.id}`} className="block relative h-56 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-900 font-bold">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-800 transition-all"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
          <LikeButton product={product} className="p-2 border rounded-lg hover:bg-gray-100 transition-all" />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function LikeButton({ product, size = 16, className = "" }) {
  const { isLiked, addToLikedProducts, removeFromLikedProducts } = useCart();
  const liked = isLiked(product.id);

  const handleClick = (e) => {
    e.preventDefault(); // cards are wrapped in <Link>, don't navigate
    if (liked) removeFromLikedProducts(product.id);
    else addToLikedProducts(product);
  };

  return (
    <button onClick={handleClick} aria-label={liked ? "Remove from liked products" : "Add to liked products"} className={className}>
      <Heart size={size} className={liked ? "fill-red-500 stroke-red-500" : "stroke-gray-700"} />
    </button>
  );
}
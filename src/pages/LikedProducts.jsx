import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function LikedProducts() {
  const { likedProducts, removeFromLikedProducts } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");

  // Categories are derived from the liked products themselves (name + slug
  // both live on the canonical product shape), so this page never has to
  // fetch the full category list just to build its filter chips.
  const likedCategories = [...new Map(likedProducts.map((p) => [p.category, { id: p.category, name: p.categoryName || p.category }])).values()];
  const filtered =
    activeCategory === "all" ? likedProducts : likedProducts.filter((p) => p.category === activeCategory);

  if (likedProducts.length === 0) {
    return (
      <section className="py-24 text-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg mb-4">You have no liked products yet.</p>
        <Link to="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Liked Products</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          {[{ id: "all", name: "All" }, ...likedCategories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <Link to={`/product/${product.id}`} className="block h-56 bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-900 font-bold mb-3">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 text-center bg-gray-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition-all"
                  >
                    Buy
                  </Link>
                  <button
                    onClick={() => removeFromLikedProducts(product.id)}
                    className="p-2 border rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

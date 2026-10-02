import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";
import LikeButton from "../components/LikeButton";

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <section className="py-24 text-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
        <Link
          to="/shop"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.color}`} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.color && <p className="text-xs text-gray-500 capitalize">Color: {item.color}</p>}
                  <p className="text-gray-900 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 border rounded-lg hover:bg-gray-100 font-bold">-</button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 border rounded-lg hover:bg-gray-100 font-bold">+</button>
                </div>
                <LikeButton product={item} size={18} className="p-2" />
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Delivery</span>
              <span>Calculated at delivery</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-4 mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <section className="py-24 min-h-screen bg-gray-50 text-center">
      <div className="container mx-auto px-4">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order placed successfully!</h1>
        <p className="text-gray-600 mb-8">
          {order
            ? `Thanks ${order.customer.name}, we'll contact you soon to confirm delivery.`
            : "We'll contact you soon to confirm delivery."}
        </p>
        {order && (
          <p className="text-gray-500 mb-8">
            Order total: <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span> (Cash on Delivery)
          </p>
        )}
        <Link to="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

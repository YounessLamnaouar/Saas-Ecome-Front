import { T } from '@/context/Preferences';
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Truck, ShoppingBag, MessageSquare } from "lucide-react";

const STORE_WHATSAPP = "212694039188";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  const orderCode = order?.code || "";
  const orderTotal = typeof order?.total === "number" ? order.total.toFixed(2) : order?.total || "0.00";
  const customerName = order?.customer?.name || "";

  const whatsappMessage = orderCode
    ? `Hello, I placed order ${orderCode} on your store for a total of $${orderTotal}. Please confirm my order.`
    : "Hello, I just placed an order on your store.";
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  if (!order) return <section className="py-24 text-center"><p> <T>No order selected.</T> </p><Link to="/shop"> <T>Continue Shopping</T> </Link></section>;

  return (
    <section className="py-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"> <T>Order Placed Successfully!</T> </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            <T>{customerName
              ? `Thank you, ${customerName}! We have received your order and are processing it.`
              : "Thank you! We have received your order and are processing it."}</T>
          </p>

          {orderCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-xs text-amber-700 font-medium uppercase tracking-wider mb-1"> <T>Your Tracking Code</T> </p>
              <p className="text-2xl font-mono font-bold text-amber-900 tracking-wide select-all">{orderCode}</p>
              <p className="text-xs text-amber-600 mt-1"> <T>Keep this code to track your delivery status anytime.</T> </p>
            </div>
          )}

          <div className="border-t border-b border-gray-100 py-4 mb-6 flex justify-between items-center text-sm">
            <span className="text-gray-500"> <T>Total (Cash on Delivery):</T> </span>
            <span className="text-lg font-bold text-gray-900">${orderTotal}</span>
          </div>

          <div className="flex flex-col gap-3">
            {orderCode && (
              <Link
                to={`/orders/${orderCode}`}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck size={18} /> <T>Track My Order</T> </Link>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={18} /> <T>Confirm via WhatsApp</T> </a>

            <Link
              to="/shop"
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <ShoppingBag size={18} /> <T>Continue Shopping</T> </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

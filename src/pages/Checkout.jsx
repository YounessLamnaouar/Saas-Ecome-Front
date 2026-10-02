import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// TODO: replace with your real WhatsApp Business number (country code, no + and no spaces)
const STORE_WHATSAPP = "212694039188";
// TODO: replace with your real store email
const STORE_EMAIL = "youneslam12@gmail.com";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildOrderSummary = () => {
    const lines = cart.map((item) => `- ${item.name} x${item.qty} = $${(item.price * item.qty).toFixed(2)}`);
    return [
      `New order from ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}, ${form.city}`,
      form.notes ? `Notes: ${form.notes}` : null,
      "",
      "Items:",
      ...lines,
      "",
      `Total: $${cartTotal.toFixed(2)} (Cash on Delivery)`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) return;

    const order = {
      id: Date.now(),
      items: cart,
      total: cartTotal,
      customer: form,
      paymentMethod: "Cash on Delivery",
      createdAt: new Date().toISOString(),
    };

    // Until the backend exists, keep a local order history in the browser
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...savedOrders, order]));

    clearCart();
    navigate("/order-confirmation", { state: { order } });
  };

  const summary = buildOrderSummary();
  const whatsappLink = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(summary)}`;
  const mailtoLink = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent("New Order")}&body=${encodeURIComponent(summary)}`;

  if (cart.length === 0) {
    return (
      <section className="py-24 text-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delivery Information</h2>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" required className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Street address" required className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900" />
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Order notes (optional)" rows={3} className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900" />

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
              Payment method: <span className="font-semibold text-gray-900">Cash on Delivery</span>
            </div>

            <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2">
              Place Order
            </button>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
              >
                Send order via WhatsApp
              </a>
              <a
                href={mailtoLink}
                className="flex-1 text-center border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Send order via Email
              </a>
            </div>
          </form>

          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x{item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

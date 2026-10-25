import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "@/services/ordersService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Please fill in all required delivery fields.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          notes: form.notes?.trim() || "",
        },
        items: cart.map((item) => ({
          product_id: Number(item.id),
          quantity: Number(item.qty),
          color: item.color || null,
        })),
      };

      const createdOrder = await createOrder(orderPayload);

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });

      toast.success("Order placed successfully! Inventory updated.");
      clearCart();
      navigate("/order-confirmation", { state: { order: createdOrder } });
    } catch (err) {
      toast.error(err.payload?.message || err.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name *"
              required
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number *"
              required
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address *"
              required
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City *"
              required
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Order notes (optional)"
              rows={3}
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900"
            />

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
              Payment method: <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </form>

          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.name} x{item.qty}
                  </span>
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

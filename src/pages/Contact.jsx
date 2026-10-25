import { translate } from '@/lib/translations';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import React, { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const STORE_WHATSAPP = "212694039188";

export default function Contact() {
 const { t: tr } = useTranslationPreferences();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(translate("Please fill in all required fields."));
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(translate("Thank you! Your message has been sent successfully."));
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 600);
  };

  const whatsappLink = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hello! I would like to inquire about your products.")}`;

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"> <T>Contact</T> <span className="text-amber-600"> <T>Us</T> </span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg"> <T>Have questions, feedback, or need help with your order? Reach out to us anytime — we are here to assist you!</T> </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100"> <T>Contact Information</T> </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-xl shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm"> <T>Our Address</T> </h3>
                    <p className="text-gray-600 text-sm mt-0.5"> <T>123 Fashion Street, City, CT 20002</T> </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-xl shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm"> <T>Phone Number</T> </h3>
                    <p className="text-gray-600 text-sm mt-0.5">06 12 34 56 78</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-xl shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm"> <T>Email Address</T> </h3>
                    <p className="text-gray-600 text-sm mt-0.5"> <T>info@fashionstore.com</T> </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-xl shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm"> <T>Working Hours</T> </h3>
                    <p className="text-gray-600 text-sm mt-0.5"> <T>Mon - Sat: 9:00 AM - 8:00 PM</T> </p>
                    <p className="text-gray-400 text-xs mt-0.5"> <T>Sunday: Closed</T> </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
              >
                <MessageSquare size={18} /> <T>Chat on WhatsApp</T> </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100"> <T>Send Us a Message</T> </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1"> <T>Your Name</T> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={tr("John Doe")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1"> <T>Email Address</T> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={tr("john@example.com")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1"> <T>Phone Number</T> </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={tr("0612345678")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1"> <T>Subject</T> </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder={tr("Order inquiry, feedback...")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1"> <T>Message</T> <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={tr("How can we help you today?")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all cursor-pointer text-sm shadow-md disabled:opacity-50"
              >
                <Send size={16} />
                <T>{isSubmitting ? "Sending..." : "Send Message"}</T>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

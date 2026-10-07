import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, MapPin, Phone, HelpCircle, Ruler, Info, MessageSquare } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Footer() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success("Thank you for subscribing to our newsletter!");
      setNewsletterEmail("");
    }
  };

  const socialIcons = [
    { icon: FaFacebook, href: "#" },
    { icon: FaXTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaYoutube, href: "#" },
  ];

  return (
    <>
      {/* Dialog: Size Guide */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Ruler size={20} /> Size Guide
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Standard Apparel Measurements (Inches)</p>
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">Size</th>
                  <th className="p-2">Chest</th>
                  <th className="p-2">Waist</th>
                  <th className="p-2">Hips</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2 text-left font-bold">S</td><td className="p-2">34-36"</td><td className="p-2">28-30"</td><td className="p-2">35-37"</td></tr>
                <tr className="border-b"><td className="p-2 text-left font-bold">M</td><td className="p-2">38-40"</td><td className="p-2">32-34"</td><td className="p-2">39-41"</td></tr>
                <tr className="border-b"><td className="p-2 text-left font-bold">L</td><td className="p-2">42-44"</td><td className="p-2">36-38"</td><td className="p-2">43-45"</td></tr>
                <tr><td className="p-2 text-left font-bold">XL</td><td className="p-2">46-48"</td><td className="p-2">40-42"</td><td className="p-2">47-49"</td></tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: FAQs */}
      <Dialog open={faqsOpen} onOpenChange={setFaqsOpen}>
        <DialogContent className="max-w-lg p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <HelpCircle size={20} /> Frequently Asked Questions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-gray-600 max-h-96 overflow-y-auto pr-1">
            <div>
              <p className="font-bold text-gray-900 mb-1">What shipping options are available?</p>
              <p>We offer standard express delivery (2-4 business days) with Cash on Delivery options nationwide.</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">How can I track my order status?</p>
              <p>You will receive WhatsApp and email updates once your order is processed and dispatched.</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">What is your return policy?</p>
              <p>We accept hassle-free returns within 14 days of delivery for unworn items with original tags.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: About Us */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Info size={20} /> About Fashion Store
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-gray-600">
            <p>
              We bring you carefully selected fashion styles for men, women, and kids that combine quality, comfort, and modern design.
            </p>
            <p>
              Founded in 2026, our mission is to deliver premium apparel and seamless shopping experiences directly to your doorstep.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                FASHION
                <span className="text-xs align-top ml-0.5">@</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Discover the latest fashion trends for men, women, and kids. We bring you carefully selected styles that combine quality, comfort, and modern design — all in one place.
              </p>
              <div className="flex gap-3">
                {socialIcons.map((e, i) => (
                  <a key={i} href={e.href} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300">
                    <e.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => setAboutOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#contact-info" className="hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </a>
                </li>
                <li>
                  <button onClick={() => setSizeGuideOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    Size Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => setFaqsOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    FAQs
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => navigate("/shop?category=men")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Men's Fashion
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/shop?category=women")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Women's Wear
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/shop?category=kids")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Kid's Collection
                  </button>
                </li>
              </ul>
            </div>

            <div id="contact-info">
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">123 Fashion Street, City, CT 20002</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">06 12 34 56 78</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">info@fashionstore.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Subscribe to Newsletter</h3>
                <p className="text-gray-400 text-sm">
                  Stay up to date with our latest collections, exclusive offers, and fashion inspiration.
                </p>
              </div>
              <form onSubmit={handleNewsletter} className="flex w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-lg w-full md:w-64 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-600"
                />
                <button type="submit" className="bg-white text-gray-900 px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer shrink-0">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-2">
              <span>© 2026 Fashion. All rights reserved.</span>
              <span className="flex items-center gap-2">
                Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Youness LAMNAOUAR
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

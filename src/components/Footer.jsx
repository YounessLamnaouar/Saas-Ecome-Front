import { translate } from '@/lib/translations';
import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, MapPin, Phone, HelpCircle, Ruler, Info, MessageSquare } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Footer() {
 const { t: tr } = useTranslationPreferences();

  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success(translate("Thank you for subscribing to our newsletter!"));
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
              <Ruler size={20} /> <T>Size Guide</T> </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-900"> <T>Standard Apparel Measurements (Inches)</T> </p>
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left"> <T>Size</T> </th>
                  <th className="p-2"> <T>Chest</T> </th>
                  <th className="p-2"> <T>Waist</T> </th>
                  <th className="p-2"> <T>Hips</T> </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2 text-left font-bold"> <T>S</T> </td><td className="p-2">34-36"</td><td className="p-2">28-30"</td><td className="p-2">35-37"</td></tr>
                <tr className="border-b"><td className="p-2 text-left font-bold"> <T>M</T> </td><td className="p-2">38-40"</td><td className="p-2">32-34"</td><td className="p-2">39-41"</td></tr>
                <tr className="border-b"><td className="p-2 text-left font-bold"> <T>L</T> </td><td className="p-2">42-44"</td><td className="p-2">36-38"</td><td className="p-2">43-45"</td></tr>
                <tr><td className="p-2 text-left font-bold"> <T>XL</T> </td><td className="p-2">46-48"</td><td className="p-2">40-42"</td><td className="p-2">47-49"</td></tr>
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
              <HelpCircle size={20} /> <T>Frequently Asked Questions</T> </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-gray-600 max-h-96 overflow-y-auto pr-1">
            <div>
              <p className="font-bold text-gray-900 mb-1"> <T>What shipping options are available?</T> </p>
              <p> <T>We offer standard express delivery (2-4 business days) with Cash on Delivery options nationwide.</T> </p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1"> <T>How can I track my order status?</T> </p>
              <p> <T>You will receive WhatsApp and email updates once your order is processed and dispatched.</T> </p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1"> <T>What is your return policy?</T> </p>
              <p> <T>We accept hassle-free returns within 14 days of delivery for unworn items with original tags.</T> </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: About Us */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Info size={20} /> <T>About Fashion Store</T> </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-gray-600">
            <p> <T>We bring you carefully selected fashion styles for men, women, and kids that combine quality, comfort, and modern design.</T> </p>
            <p> <T>Founded in 2026, our mission is to deliver premium apparel and seamless shopping experiences directly to your doorstep.</T> </p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4"> <T>FASHION</T> <span className="text-xs align-top ml-0.5">@</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4"> <T>Discover the latest fashion trends for men, women, and kids. We bring you carefully selected styles that combine quality, comfort, and modern design — all in one place.</T> </p>
              <div className="flex gap-3">
                {socialIcons.map((e, i) => (
                  <a key={i} href={e.href} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300">
                    <e.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4"> <T>Quick Links</T> </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => setAboutOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left"> <T>About Us</T> </button>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors cursor-pointer"> <T>Contact Us</T> </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:text-white transition-colors cursor-pointer"> <T>Track Order</T> </Link>
                </li>
                <li>
                  <button onClick={() => setSizeGuideOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left"> <T>Size Guide</T> </button>
                </li>
                <li>
                  <button onClick={() => setFaqsOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left"> <T>FAQs</T> </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4"> <T>Categories</T> </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => navigate("/shop?category=men")} className="hover:text-white transition-colors cursor-pointer text-left"> <T>Men's Fashion</T> </button>
                </li>
                <li>
                  <button onClick={() => navigate("/shop?category=women")} className="hover:text-white transition-colors cursor-pointer text-left"> <T>Women's Wear</T> </button>
                </li>
                <li>
                  <button onClick={() => navigate("/shop?category=kids")} className="hover:text-white transition-colors cursor-pointer text-left"> <T>Kid's Collection</T> </button>
                </li>
              </ul>
            </div>

            <div id="contact-info">
              <h3 className="text-lg font-semibold mb-4"> <T>Contact Info</T> </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm"> <T>123 Fashion Street, City, CT 20002</T> </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">06 12 34 56 78</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm"> <T>info@fashionstore.com</T> </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1"> <T>Subscribe to Newsletter</T> </h3>
                <p className="text-gray-400 text-sm"> <T>Stay up to date with our latest collections, exclusive offers, and fashion inspiration.</T> </p>
              </div>
              <form onSubmit={handleNewsletter} className="flex w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={tr("Enter your email")}
                  className="px-4 py-2 rounded-l-lg w-full md:w-64 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-600"
                />
                <button type="submit" className="bg-white text-gray-900 px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer shrink-0"> <T>Subscribe</T> </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-2">
              <span> <T>© 2026 Fashion. All rights reserved.</T> </span>
              <span className="flex items-center gap-2"> <T>Made with</T> <Heart size={14} className="text-red-500 fill-red-500" /> <T>by Youness LAMNAOUAR</T> </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

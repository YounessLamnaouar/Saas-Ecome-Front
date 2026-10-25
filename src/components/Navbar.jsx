import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useUserAuth } from "../context/UserAuthContext";
import { Heart, Menu, Search, ShoppingBag, X, User, LogOut, Package, Truck } from "lucide-react";
import UserAuthModal from "./UserAuthModal";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ transparent = true, bg = "bg-gray-900" }) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLink, setActiveLink] = useState("/");
  const [hoveredLink, setHoveredLink] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartCount, likedProducts } = useCart();
  const { user, isLoggedIn, logoutCustomer } = useUserAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.shop"), path: "/shop" },
    { name: t("nav.collection"), path: "/collection" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <>
      <UserAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      <nav className={`relative z-50 ${transparent ? "" : bg}`}>
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-white text-2xl font-bold tracking-tight">
              FASHION
              <span className="text-xs align-top ms-0.5">@</span>
            </Link>

            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex gap-8 lg:gap-12 text-dark">
                {navLinks.map((link) => (
                  <Link
                    to={link.path}
                    key={link.path}
                    onClick={() => setActiveLink(link.path)}
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`text-white relative font-medium transition-opacity hover:opacity-70 ${
                      activeLink === link.path ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {link.name}
                    {(hoveredLink === link.path || activeLink === link.path) && (
                      <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-white rounded-full animate-fade-in"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-white">
              {/* Language Switcher */}
              <LanguageSwitcher variant="storefront" className="hidden sm:flex" />

              <div className="relative flex items-center">
                {isSearchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute end-8 top-1/2 -translate-y-1/2 z-20"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("nav.searchPlaceholder")}
                      className="bg-white/10 border border-white/30 rounded-full px-4 py-1.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white w-40 sm:w-56"
                    />
                  </form>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hover:opacity-70 transition-opacity cursor-pointer p-1"
                  aria-label="Search"
                >
                  {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              <Link
                to="/liked"
                className="hover:opacity-70 transition-opacity relative cursor-pointer p-1"
                aria-label={t("nav.wishlist")}
              >
                <Heart size={20} />
                <span className="absolute -top-1.5 -end-1.5 bg-white text-gray-900 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {likedProducts.length}
                </span>
              </Link>

              <Link
                to="/cart"
                className="hover:opacity-70 transition-opacity relative cursor-pointer p-1"
                aria-label={t("nav.cart")}
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-1.5 -end-1.5 bg-white text-gray-900 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </Link>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                {isLoggedIn ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      <User size={16} />
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute end-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 text-gray-900 text-start">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold truncate">{user?.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-start px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Package size={14} /> {t("nav.myOrders")}
                        </Link>
                        <Link
                          to="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-start px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Truck size={14} /> {t("nav.trackOrder")}
                        </Link>
                        <button
                          onClick={() => {
                            logoutCustomer();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-gray-100"
                        >
                          <LogOut size={14} /> {t("nav.signOut")}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="hover:opacity-70 transition-opacity flex items-center gap-1 text-xs font-medium border border-white/30 rounded-full px-3 py-1.5 cursor-pointer"
                  >
                    <User size={16} />
                    <span>{t("nav.signIn")}</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden hover:opacity-70 transition-opacity cursor-pointer p-1"
                aria-label="Open menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col gap-3 text-white text-start">
                <LanguageSwitcher variant="storefront" className="self-start mb-2" />
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      setActiveLink(link.path);
                      setIsMenuOpen(false);
                    }}
                    className={`py-2 relative transition-opacity hover:opacity-70 cursor-pointer ${
                      activeLink === link.path ? "opacity-100 font-bold" : "opacity-80"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 relative transition-opacity hover:opacity-70 cursor-pointer opacity-80 flex items-center gap-2"
                  >
                    <Package size={16} /> {t("nav.myOrders")}
                  </Link>
                )}
                <Link
                  to="/track-order"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 relative transition-opacity hover:opacity-70 cursor-pointer opacity-80 flex items-center gap-2"
                >
                  <Truck size={16} /> {t("nav.trackOrder")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

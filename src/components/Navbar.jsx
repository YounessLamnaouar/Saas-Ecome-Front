import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";

export default function Navbar({ transparent = true, bg = "bg-gray-900" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLink, setActiveLink] = useState("Home");
  const [hoveredLink, setHoveredLink] = useState(null);
  const { cartCount, likedProducts } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Collection", path: "/collection" },
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
    // Update active link based on current path
    const currentPath = window.location.pathname;
    const activeNavLink = navLinks.find((link) => link.path === currentPath);
    if (activeNavLink) {
      setActiveLink(activeNavLink.name);
    }
  }, [activeLink]);

  return (
    <nav className={`relative z-50 ${transparent ? "" : bg}`}>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold tracking-tight">
            FASHION
            <span className="text-xs align-top ml-0.5">@</span>
          </Link>
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex gap-8 lg:gap-12 text-dark">
              {navLinks.map((link) => (
                <Link
                  to={link.path}
                  key={link.name}
                  onClick={() => setActiveLink(link.name)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`text-white relative font-medium transition-opacity hover:opacity-70 ${activeLink === link.name ? "opacity-100" : "opacity-80"}`}
                >
                  {link.name}
                  {(hoveredLink === link.name || activeLink === link.name) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="relative flex items-center">
              {isSearchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-white/10 border border-white/30 rounded-full px-4 py-1.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white w-40 sm:w-56"
                  />
                </form>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:opacity-70 transition-opacity"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
            <Link
              to="/liked"
              className="hover:opacity-70 transition-opacity relative"
            >
              <Heart size={20} />
              <span className="absolute -top-2 right-2 bg-white text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {likedProducts.length}
              </span>
            </Link>
            <Link
              to="/cart"
              className="hover:opacity-70 transition-opacity relative"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 right-2 bg-white text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:opacity-70 transition-opacity"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col gap-3 text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    setActiveLink(link.name);
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 relative transition-opacity hover:opacity-70 ${activeLink === link.name ? "opacity-100" : "opacity-80"}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

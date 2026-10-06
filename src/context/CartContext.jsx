import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserAuth } from "./UserAuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUserAuth();
  const userId = user?.id || "guest";

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(`cart_${userId}`) || localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [likedProducts, setLikedProducts] = useState(() => {
    const saved = localStorage.getItem(`liked_${userId}`) || localStorage.getItem("likedProducts");
    return saved ? JSON.parse(saved) : [];
  });

  // Reload cart & liked products whenever user logs in or switches account
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    const savedLiked = localStorage.getItem(`liked_${userId}`);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedLiked) setLikedProducts(JSON.parse(savedLiked));
  }, [userId]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    localStorage.setItem(`liked_${userId}`, JSON.stringify(likedProducts));
  }, [cart, likedProducts, userId]);

  // Liked products operations
  const addToLikedProducts = (product) => {
    setLikedProducts((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (!existing) {
        toast.success(`Added "${product.name || product.title}" to wishlist!`);
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromLikedProducts = (id) => {
    setLikedProducts((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) toast.info(`Removed "${item.name || item.title}" from wishlist.`);
      return prev.filter((item) => item.id !== id);
    });
  };

  const isLiked = (id) => likedProducts.some((item) => item.id === id);
  const isInCart = (id) => cart.some((item) => item.id === id);

  // Cart operations with Stock Limit logic
  const addToCart = (product, qty = 1) => {
    const maxStock = typeof product.stock === "number" ? product.stock : 999;
    if (maxStock <= 0) {
      toast.error(`"${product.name || product.title}" is out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.color === product.color);
      const currentQty = existing ? existing.qty : 0;
      const targetQty = currentQty + qty;

      if (targetQty > maxStock) {
        if (currentQty >= maxStock) {
          toast.error(`Cannot add more. Maximum available stock for "${product.name || product.title}" is ${maxStock}.`);
          return prev;
        }
        const allowed = maxStock - currentQty;
        toast.info(`Added ${allowed} item(s) to cart (max stock reached: ${maxStock}).`);
        return prev.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, qty: maxStock, stock: maxStock }
            : item
        );
      }

      toast.success(`Added "${product.name || product.title}" to cart!`);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, qty: targetQty, stock: maxStock }
            : item
        );
      }
      return [...prev, { ...product, qty, stock: maxStock }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) toast.info(`Removed "${item.name || item.title}" from cart.`);
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxStock = typeof item.stock === "number" ? item.stock : 999;
          if (newQty > maxStock) {
            toast.error(`Cannot exceed maximum available stock (${maxStock}) for "${item.name || item.title}".`);
            return { ...item, qty: maxStock };
          }
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        likedProducts,
        addToLikedProducts,
        removeFromLikedProducts,
        isLiked,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ila kant lcart flocale storage khodha ohta f const cart ila makant tahaja khod table khawya
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // stock dyal li drna lihom 9lb 
  const [likedProducts, setLikedProducts] = useState(() => {
    const saved = localStorage.getItem("likedProducts");
    return saved ? JSON.parse(saved) : [];
  });
 
  // finma ytra chi changement fl cart hto flocale storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
  }, [cart, likedProducts]);

  // ajouter product L liked products
  const addToLikedProducts = (product) => {
    setLikedProducts((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (!existing) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // remove product from liked products
  const removeFromLikedProducts = (id) => {
    setLikedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // check if product is liked
  const isLiked = (id) => {
    return likedProducts.some((item) => item.id === id);
  };

  // check if product is in cart
  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };

  // ajouter product L cart ila kan deja kayn nfss smiya onfs loun kadir lih increment wla makanch katzido m3a other products
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.color === product.color);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  // delete from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // modifier la quantite dyal product fl cart ila kan 1 mat9drch tzid tn9ss
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  // clear cart
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, likedProducts, addToLikedProducts, removeFromLikedProducts, isLiked, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

import { translate } from '@/lib/translations';
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUserAuth } from "./UserAuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUserAuth();
  const userId = user?.id || "guest";

  const read = (key) => { try { const value = JSON.parse(localStorage.getItem(key) || (key === 'cart_guest' ? localStorage.getItem('cart') : null) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
  const [state, setState] = useState(() => ({ owner: userId, cart: read(`cart_${userId}`), liked: read(`liked_${userId}`) }));
  const { cart, liked: likedProducts } = state;
  const stateRef = useRef(state);
  stateRef.current = state;
  // Resolve event updates once, outside React's replayable state updater.
  const updateField = (field, update) => {
    const previous = stateRef.current;
    const next = { ...previous, [field]: typeof update === 'function' ? update(previous[field]) : update };
    stateRef.current = next;
    setState(next);
  };
  const setCart = update => updateField('cart', update);
  const setLikedProducts = update => updateField('liked', update);
  useEffect(() => {
    if (state.owner !== userId) {
      let next = read(`cart_${userId}`);
      if (userId !== 'guest' && state.owner === 'guest') {
        for (const item of state.cart) {
          const existing = next.find(p => p.id === item.id && p.color === item.color);
          if (existing) existing.qty = Math.min(existing.qty + item.qty, item.stock ?? 999);
          else next.push(item);
        }
        localStorage.setItem('cart_guest', '[]');
      }
      setState({ owner: userId, cart: next, liked: read(`liked_${userId}`) });
      return;
    }
    localStorage.setItem(`cart_${state.owner}`, JSON.stringify(cart));
    localStorage.setItem(`liked_${state.owner}`, JSON.stringify(likedProducts));
  }, [userId, state]);

  // Liked products operations
  const addToLikedProducts = (product) => {
    setLikedProducts((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (!existing) {
        toast.success(translate(`Added "${product.name || product.title}" to wishlist!`));
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromLikedProducts = (id) => {
    setLikedProducts((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) toast.info(translate(`Removed "${item.name || item.title}" from wishlist.`));
      return prev.filter((item) => item.id !== id);
    });
  };

  const isLiked = (id) => likedProducts.some((item) => item.id === id);
  const isInCart = (id) => cart.some((item) => item.id === id);

  // Cart operations with Stock Limit logic
  const addToCart = (product, qty = 1) => {
    const maxStock = typeof product.stock === "number" ? product.stock : 999;
    if (maxStock <= 0) {
      toast.error(translate(`"${product.name || product.title}" is out of stock.`));
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.color === product.color);
      const currentQty = existing ? existing.qty : 0;
      const targetQty = currentQty + qty;

      if (targetQty > maxStock) {
        if (currentQty >= maxStock) {
          toast.error(translate(`Cannot add more. Maximum available stock for "${product.name || product.title}" is ${maxStock}.`));
          return prev;
        }
        const allowed = maxStock - currentQty;
        toast.info(translate(`Added ${allowed} item(s) to cart (max stock reached: ${maxStock}).`));
        return prev.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, qty: maxStock, stock: maxStock }
            : item
        );
      }

      toast.success(translate(`Added "${product.name || product.title}" to cart!`));
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
      if (item) toast.info(translate(`Removed "${item.name || item.title}" from cart.`));
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
            toast.error(translate(`Cannot exceed maximum available stock (${maxStock}) for "${item.name || item.title}".`));
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

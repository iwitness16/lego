"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usdPrice } from "@/lib/format";

const CartContext = createContext(null);
const STORAGE_KEY = "legobrickslink:cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — fail silently
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((line) => line.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [
        ...current,
        {
          id: product.id,
          type: product.type,
          number: product.number,
          name: product.name,
          theme: product.theme,
          subtheme: product.subtheme,
          image: product.image,
          rrp: product.rrp,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      current
        .map((line) =>
          line.id === id ? { ...line, quantity: Math.max(1, quantity) } : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, line) => {
        const price = usdPrice(line.rrp) || 0;
        return sum + price * line.quantity;
      }, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    hydrated,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

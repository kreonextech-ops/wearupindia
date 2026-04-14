'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data';
import { createClient } from './supabase/client';
import { User } from '@supabase/supabase-js';

type CartItem = Product & { quantity: number; selectedSize?: string };

type StoreContextType = {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
  user: User | null;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Auth Listener
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wu-cart');
      const savedWish = localStorage.getItem('wu-wishlist');
      if (saved) setCart(JSON.parse(saved));
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {}
  }, []);

  // Sync to database if logged in
  useEffect(() => {
    if (!user) return;
    
    const syncData = async () => {
      // Sync Cart
      if (cart.length > 0) {
        const cartItems = cart.map(i => ({ id: i.id, quantity: i.quantity, size: i.selectedSize }));
        await supabase.from('carts').upsert({ user_id: user.id, items: cartItems }, { onConflict: 'user_id' });
      }
      
      // Sync Wishlist
      if (wishlist.length > 0) {
        const wishItems = wishlist.map(p => p.id);
        await supabase.from('wishlists').upsert({ user_id: user.id, items: wishItems }, { onConflict: 'user_id' });
      }
    };
    
    syncData();
  }, [cart, wishlist, user, supabase]);

  useEffect(() => {
    localStorage.setItem('wu-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wu-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (id: string) => setWishlist(prev => prev.filter(p => p.id !== id));
  
  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, addToCart, removeFromCart, updateQuantity,
      addToWishlist, removeFromWishlist, isInWishlist,
      cartCount, cartTotal, clearCart, user,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};

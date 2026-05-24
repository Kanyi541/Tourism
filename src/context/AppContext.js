import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (itemId) => set((state) => ({ cart: state.cart.filter(i => i.id !== itemId) })),
  selectedDestination: null,
  setSelectedDestination: (dest) => set({ selectedDestination: dest })
}));

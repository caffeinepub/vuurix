import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../backend';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: bigint, size?: string, color?: string) => void;
  updateQuantity: (productId: bigint, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const cartItemKey = (productId: bigint, size?: string, color?: string) => 
  `${productId.toString()}-${size || 'none'}-${color || 'none'}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => 
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [...state.items, { product, quantity, size, color }]
          };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId &&
                item.size === size &&
                item.color === color)
          )
        }));
      },

      updateQuantity: (productId, quantity, size, color) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.product.id === productId &&
                    item.size === size &&
                    item.color === color)
              )
            };
          }

          const newItems = state.items.map((item) =>
            item.product.id === productId &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity }
              : item
          );
          return { items: newItems };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'vuurix-cart-storage'
    }
  )
);


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IBundle, IProduct } from '@/shared/types';

interface SpaceBundleState {
  activeBundleId: string | null;
  name: string;
  items: Array<{
    productId?: string;
    nestedBundleId?: string;
    quantity: number;
    priceSnapshot: number;
    product?: IProduct;
    nestedBundle?: IBundle;
  }>;
  totalPrice: number;
}

interface SpaceBundleActions {
  setActiveBundle: (bundle: IBundle | null) => void;
  addItem: (item: {
    product?: IProduct;
    nestedBundle?: IBundle;
    quantity: number;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBundle: () => void;
}

const initialState: SpaceBundleState = {
  activeBundleId: null,
  name: 'New Project Bundle',
  items: [],
  totalPrice: 0,
};

export const useSpaceBundleStore = create<
  SpaceBundleState & SpaceBundleActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveBundle: bundle => {
        if (!bundle) {
          set(initialState);
          return;
        }
        set({
          activeBundleId: bundle.id,
          name: bundle.name,
          items: bundle.items.map(item => ({
            productId: item.product?.id,
            nestedBundleId: item.nestedBundle?.id,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
            product: item.product || undefined,
            nestedBundle: item.nestedBundle || undefined,
          })),
          totalPrice: bundle.totalPrice,
        });
      },

      addItem: ({ product, nestedBundle, quantity }) => {
        const { items } = get();

        const existingItemIndex = items.findIndex(
          i =>
            (product && i.productId === product.id) ||
            (nestedBundle && i.nestedBundleId === nestedBundle.id),
        );

        const newItems = [...items];
        const price = product?.price || nestedBundle?.totalPrice || 0;

        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems.push({
            productId: product?.id,
            nestedBundleId: nestedBundle?.id,
            quantity,
            priceSnapshot: price,
            product,
            nestedBundle,
          });
        }

        const newTotal = newItems.reduce(
          (sum, item) => sum + item.priceSnapshot * item.quantity,
          0,
        );
        set({ items: newItems, totalPrice: newTotal });
      },

      removeItem: id => {
        const { items } = get();
        const newItems = items.filter(
          i => i.productId !== id && i.nestedBundleId !== id,
        );
        const newTotal = newItems.reduce(
          (sum, item) => sum + item.priceSnapshot * item.quantity,
          0,
        );
        set({ items: newItems, totalPrice: newTotal });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const newItems = items.map(i => {
          if (i.productId === id || i.nestedBundleId === id) {
            return { ...i, quantity };
          }
          return i;
        });
        const newTotal = newItems.reduce(
          (sum, item) => sum + item.priceSnapshot * item.quantity,
          0,
        );
        set({ items: newItems, totalPrice: newTotal });
      },

      clearBundle: () => set(initialState),
    }),
    {
      name: 'gyp6-space-bundle-storage',
      partialize: state => {
        if (state.activeBundleId !== null) {
          return {
            activeBundleId: null,
            name: 'New Project Bundle',
            items: [],
            totalPrice: 0,
          };
        }
        return state;
      },
    },
  ),
);

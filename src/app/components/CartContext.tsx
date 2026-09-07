"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

export type CartProduct = {
  id: number;

  /*
   * UUID-ul real al produsului din Supabase.
   * Este folosit la checkout pentru ca serverul
   * să recitească produsul și prețul real.
   */
  databaseId?: string;

  name: string;
  brand: string;
  category: string;

  price: number;
  oldPrice?: number;

  stock: string;
  delivery: string;

  code: string;

  recommended?: boolean;
};

export type CartItem =
  CartProduct & {
    quantity: number;
  };

type CartContextType = {
  items: CartItem[];

  cartCount: number;
  subtotal: number;

  addToCart: (
    product: CartProduct
  ) => void;

  removeFromCart: (
    id: number
  ) => void;

  increaseQuantity: (
    id: number
  ) => void;

  decreaseQuantity: (
    id: number
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(
    null
  );

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  /*
   * Încărcăm coșul salvat în browser.
   */
  useEffect(() => {
    try {
      const savedCart =
        window.localStorage.getItem(
          "garagio-cart"
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(
            savedCart
          ) as CartItem[];

        if (
          Array.isArray(
            parsedCart
          )
        ) {
          setItems(
            parsedCart
          );
        }
      }
    } catch (error) {
      console.error(
        "Eroare la încărcarea coșului:",
        error
      );
    } finally {
      setIsLoaded(
        true
      );
    }
  }, []);

  /*
   * Persistăm coșul.
   */
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        "garagio-cart",
        JSON.stringify(
          items
        )
      );
    } catch (error) {
      console.error(
        "Eroare la salvarea coșului:",
        error
      );
    }
  }, [
    items,
    isLoaded,
  ]);

  function addToCart(
    product: CartProduct
  ) {
    setItems(
      (currentItems) => {
        /*
         * Dacă avem UUID Supabase,
         * acesta devine identificatorul
         * principal pentru produs.
         *
         * Pentru produsele vechi salvate
         * înainte de Supabase păstrăm
         * fallback-ul pe id.
         */
        const existingItem =
          currentItems.find(
            (item) => {
              if (
                product.databaseId &&
                item.databaseId
              ) {
                return (
                  item.databaseId ===
                  product.databaseId
                );
              }

              return (
                item.id ===
                product.id
              );
            }
          );

        if (
          existingItem
        ) {
          return currentItems.map(
            (item) => {
              const isSameProduct =
                product.databaseId &&
                item.databaseId
                  ? item.databaseId ===
                    product.databaseId
                  : item.id ===
                    product.id;

              return isSameProduct
                ? {
                    ...item,

                    /*
                     * Sincronizăm și
                     * datele produsului.
                     */
                    ...product,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item;
            }
          );
        }

        return [
          ...currentItems,

          {
            ...product,
            quantity: 1,
          },
        ];
      }
    );
  }

  function removeFromCart(
    id: number
  ) {
    setItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== id
        )
    );
  }

  function increaseQuantity(
    id: number
  ) {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.id === id
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item
        )
    );
  }

  function decreaseQuantity(
    id: number
  ) {
    setItems(
      (currentItems) =>
        currentItems
          .map(
            (item) =>
              item.id === id
                ? {
                    ...item,

                    quantity:
                      item.quantity -
                      1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.quantity >
              0
          )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  const subtotal =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        items,

        cartCount,
        subtotal,

        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart trebuie folosit în interiorul CartProvider."
    );
  }

  return context;
}
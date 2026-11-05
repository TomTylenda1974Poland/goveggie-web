"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_CART, parseStoredCart, type Cart } from "./cart";

const STORAGE_KEY = "pv-cart-v1";
const listeners = new Set<() => void>();
let current: Cart | null = null;

function read(): Cart {
  if (current === null) {
    try {
      current = parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      current = EMPTY_CART;
    }
  }
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      current = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Sustituye el carrito, lo guarda en el navegador y avisa a los componentes. */
export function updateCart(change: (cart: Cart) => Cart): void {
  current = change(read());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Modo privado o almacenamiento lleno: el carrito sigue en memoria.
  }
  for (const l of listeners) l();
}

/** Carrito actual. En el servidor y en el primer render devuelve un carrito vacío. */
export function useCart(): Cart {
  return useSyncExternalStore(subscribe, read, () => EMPTY_CART);
}

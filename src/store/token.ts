// tokenStore.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";

const TOKEN_KEY = "auth.jwt";

const isWeb = Platform.OS === "web";

export const getToken = async () => {
  const isWeb = Platform.OS === "web";
  if (isWeb && typeof window === "undefined") return;
  const savedPayload = isWeb ? localStorage.getItem(TOKEN_KEY) : await SecureStore.getItemAsync(TOKEN_KEY);
  const parsedPayload: {state: {token: string | null}} = await JSON.parse(savedPayload);

  return parsedPayload?.state?.token;
}

const isSSR = () => typeof window === "undefined";
/**
 * Zustand persistence adapter backed by Expo SecureStore.
 */
const expoSecureStoreStorage: StateStorage = {
  getItem: async (name) => {
    if (isSSR()) return;
    if (isWeb) return window?.localStorage.getItem(name) as string;
    return await SecureStore.getItemAsync(name)
  },
  setItem: async (name, value) => {
    if (isSSR()) return;
    if (isWeb) return window?.localStorage.setItem(name, value) as string | void;
    return await SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    })
  },
  removeItem: async (name) => {
    if (isSSR()) return;
    if (isWeb) window?.localStorage.removeItem(name);
    return await SecureStore.deleteItemAsync(name)
  }
};

type TokenStore = {
  token: string | null;
  hydrated: boolean;
  save: (token: string | null) => void;
  clear: () => void;
};

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      hydrated: false,
      save: (token) => set({ token }),
      clear: () => set({ token: null }),
    }),
    {
      name: TOKEN_KEY,
      storage: createJSONStorage(() => expoSecureStoreStorage),
      partialize: (s) => ({ token: s.token }),
      onRehydrateStorage: () => (_state, _error) => {
        // runs after persisted state is loaded (success or error)
        useTokenStore.setState({ hydrated: true });
      },
    }
  )
);

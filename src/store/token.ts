// tokenStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";

const TOKEN_KEY = "auth.jwt";

export const getToken = async () => {
  const savedPayload = await SecureStore.getItemAsync(TOKEN_KEY);
  const parsedPayload: {state: {token: string | null}} = await JSON.parse(savedPayload);

  return parsedPayload?.state?.token;
}

/**
 * Zustand persistence adapter backed by Expo SecureStore.
 */
const expoSecureStoreStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) =>
    SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    }),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
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

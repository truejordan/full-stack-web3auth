import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

interface WalletState {
  address: string | undefined;
  balance: number | undefined;

  setAddress: (address: string | undefined) => void;
  setBalance: (balance: number | undefined) => void;
}

// Create custom SecureStore storage adapter
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: undefined,
      balance: undefined,

      setAddress: (address) => set({ address }),
      setBalance: (balance) => set({ balance }),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => secureStorage),
      // Only persists address, not balance (balance should come from API)
      partialize: (state) => ({
        address: state.address,
      }),
    }
  )
);

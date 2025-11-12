import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  // State
  user: string | undefined;
  loginEmail: string | null;
  session: Session | null;
  authLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: string | undefined) => void;
  setLoginEmail: (loginEmail: string | null) => void;
  setSession: (session: Session | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  user: undefined,
  loginEmail: null,
  session: null,
  authLoading: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthState>()(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setLoginEmail: (loginEmail) => set({ loginEmail }),
      setSession: (session) => set({ session }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      setIsInitialized: (initialized) => set({ isInitialized: initialized }),
      reset: () => set((state) => ({ ...initialState, session: state.session })),
    }),
  
);

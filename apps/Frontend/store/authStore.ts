import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  // State
  user: string | undefined;
  loginEmail: string | null;
  session: Session | null;
  authLoading: boolean;

  // Actions
  setUser: (user: string | undefined) => void;
  setLoginEmail: (loginEmail: string | null) => void;
  setSession: (session: Session | null) => void;
  setAuthLoading: (loading: boolean) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  user: undefined,
  loginEmail: null,
  session: null,
  authLoading: false,
};

export const useAuthStore = create<AuthState>()(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setLoginEmail: (loginEmail) => set({ loginEmail }),
      setSession: (session) => set({ session }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      reset: () => set((state) => ({ ...initialState, session: state.session })),
    }),
  
);

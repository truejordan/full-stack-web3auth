import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";

/**
 * Initialize Supabase auth listeners and restore session
 * Call this once at the root of your app
 */
export const useAuthInit = () => {
  const { setSession, setAuthLoading, setUser } = useAuthStore();
  const { setAddress } = useWalletStore();

  useEffect(() => {
    let mounted = true;

    // Initialize session
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setAuthLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session);

        if (event === "TOKEN_REFRESHED" && session) {
          // Token refreshed, session already updated
          console.log("Token refreshed");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setAuthLoading, setAddress, setUser]);
};

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";
import { useConnectWeb3Auth } from "../queries/useWeb3Auth";
import { Alert } from "react-native";

/**
 * Initialize Supabase auth listeners and restore session
 * Call this once at the root of your app
 */
export const useAuthInit = () => {
  const { setSession, setAuthLoading, setUser, setIsInitialized } = useAuthStore();
  const { setAddress, setBalance } = useWalletStore();
  const connectWeb3Auth = useConnectWeb3Auth();

  useEffect(() => {
    let mounted = true;

    // Initialize session
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        if (session?.user) {
          setUser(session.user.id);
        } else {
          setUser(undefined);
          setBalance(undefined);
          setAddress(undefined);
        }
        setAuthLoading(false);
        setIsInitialized(true);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session);
        if (session?.user) {
          setUser(session.user.id);
          // Connect to Web3Auth on initial sign-in (works for OTP and OAuth)
          try {
            if (session.access_token && event === "SIGNED_IN") {
              console.log("connecting to web3auth");
              connectWeb3Auth.mutate(session.access_token);
            }
          } catch (error) {
            console.log("Error connecting to Web3Auth:", error);
            Alert.alert("Web3Auth Error", "Failed to connect to Web3Auth. Please try again.");
          }
        } else {
          setUser(undefined);
          setBalance(undefined);
          setAddress(undefined);
        }

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
  }, [setSession, setAuthLoading, setAddress, setUser, setBalance]);
};

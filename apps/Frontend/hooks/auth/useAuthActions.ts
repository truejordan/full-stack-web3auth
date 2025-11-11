import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useConnectWeb3Auth } from "../queries/useWeb3Auth";
import { useWalletStore } from "@/store/walletStore";

export const useAuthActions = () => {
  const router = useRouter();
  const { loginEmail, setLoginEmail, setUser, setSession, session } = useAuthStore();
  const connectWeb3Auth = useConnectWeb3Auth();

  const loggedIn = !!session?.user 

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signInWithOtp = async (email: string, requestOTP: boolean = false) => {
    if (!email || !isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;
      setLoginEmail(email);
      if (!requestOTP) {
        router.push("/otp");
      }
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async (tokenHash: string) => {
    if (!loginEmail) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: loginEmail,
        token: tokenHash,
        type: "email",
      });

      if (error) throw error;
      if (data?.user && data?.session) {
        setUser(data.user.id);
        setLoginEmail(null);
        setSession(data.session);

        // Connect to Web3Auth after successful login
        if (data?.session?.access_token) {
          console.log("connecting to web3auth");
          connectWeb3Auth.mutate(data.session.access_token);
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
        Alert.alert("Error", "Failed to logout. Please try again.");
        return;
      }
      
      // Clear all state
      const { reset } = useAuthStore.getState();
      const { setAddress, setBalance } = useWalletStore.getState();
      
      await setAddress(undefined);
      reset();
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  /**
   * Get fresh token for Web3Auth (must be < 6 minutes old)
   */
  const getFreshTokenForWeb3Auth = async (): Promise<string | null> => {
    if (!session?.access_token) {
      return null;
    }

    const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now();
    const tokenLifetime = 3600 * 1000; // 1 hour
    const issuedAt = expiresAt - tokenLifetime;
    const now = Date.now();
    const age = now - issuedAt;
    const maxAge = 5 * 60 * 1000; // 5 minutes

    if (age > maxAge) {
      console.log("Token too old, refreshing...");
      const {
        data: { session: refreshedSession },
        error,
      } = await supabase.auth.refreshSession();

      if (error || !refreshedSession) {
        console.error("Error refreshing session:", error);
        return null;
      }

      setSession(refreshedSession);
      return refreshedSession.access_token;
    }

    return session.access_token;
  };

  return {
    signInWithOtp,
    verifyOtp,
    logout,
    isValidEmail,
    getFreshTokenForWeb3Auth,
    loggedIn,
  };
};
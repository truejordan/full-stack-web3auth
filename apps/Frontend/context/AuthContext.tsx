import React, { useContext, createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: string | undefined;
  signInWithOtp: (email: string, requestOTP?: boolean) => Promise<void>;
  verifyOtp: (tokenHash: string) => Promise<void>;
  email: string | null;
  setEmail: (email: string) => void;
  loggedIn: boolean;
  session: Session | null;
  isValidEmail: (email: string) => boolean;
  logout: () => Promise<void>;
  address: string | undefined;
  balance: number | undefined;
  getBalance: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const ADDRESS_STORAGE_KEY = "WALLET_ADDRESS";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<string | undefined>(undefined);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // restore address from secure store if not already set
  useEffect(() => {
    if (session && !address) {
      SecureStore.getItemAsync(ADDRESS_STORAGE_KEY)
        .then((storedAddress) => {
          if (storedAddress && storedAddress.trim() !== "") {
            setAddress(storedAddress);
            setLoggedIn(true);
          }
        })
        .catch(console.error);
    }
  }, [session, address]);

  //* helpers functions *//
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 
  /** 
   * @function getFreshTokenForWeb3Auth
   * @description use for web3auth api calls that require an id token post login
   * @returns the fresh token if older than 5 minutes, null if error or same token if fresh
   */
  const getFreshTokenForWeb3Auth = async (): Promise<string | null> => {
    // Use the session state we already have
    if (!session?.access_token) {
      return null;
    }

    // Check token age (Web3Auth requires < 6 minutes)
    const expiresAt = session.expires_at
      ? session.expires_at * 1000
      : Date.now();
    const tokenLifetime = 3600 * 1000; // 1 hour in milliseconds
    const issuedAt = expiresAt - tokenLifetime;
    const now = Date.now();
    const age = now - issuedAt;
    const maxAge = 5 * 60 * 1000; // 5 minutes (1 min buffer before 6 min limit)

    // Only refresh if token is older than 5 minutes
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

      // Update session state with refreshed session
      setSession(refreshedSession);

      return refreshedSession.access_token;
    }

    // Token is fresh enough, use it
    return session.access_token;
  };

  //* Authentication functions *//

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
      setEmail(email);
      if (!requestOTP) {
        router.push("/otp");
      }
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
    }
  };

  const verifyOtp = async (tokenHash: string) => {
    if (!email) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: tokenHash,
        type: "email",
      });

      if (error) throw error;
      if (data?.user && data?.session) {
        setUser(data.user.id);
        setLoggedIn(true);
        setEmail("");

        if (data?.session?.access_token) {
          console.log("connecting to web3auth");
          connectWeb3Auth(data.session.access_token);
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
      await SecureStore.deleteItemAsync(ADDRESS_STORAGE_KEY);
      setLoggedIn(false);
      setUser(undefined);
      setEmail(null);
      setSession(null);
      setAddress(undefined);
      setBalance(undefined);
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  // connect to web3auth login connector
  const connectWeb3Auth = async (idToken: string) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/web3auth/connect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: idToken }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Failed to connect to web3auth:", errorData);
        Alert.alert(
          "Web3Auth Error",
          errorData.error || "Failed to connect to Web3Auth"
        );
        return;
      }

      const data = await response.json();
      if (data.address) {
        setAddress(data.address);
        // Only persist if address is valid
        await SecureStore.setItemAsync(ADDRESS_STORAGE_KEY, data.address);
        setLoggedIn(true);
        console.log("web3auth connected", data);
      } else {
        console.error("No address in response:", data);
        Alert.alert(
          "Error",
          "Web3Auth connection succeeded but no address returned"
        );
      }
    } catch (error) {
      console.error("Error connecting to web3auth:", error);
      Alert.alert("Error", "Failed to connect to Web3Auth. Please try again.");
    }
  };

  const getBalance = async () => {
    if (!session?.access_token) {
      Alert.alert("Error", "Please login to get balance");
      return;
    }
    if (!address) {
      Alert.alert("Error", "Wallet address not found. Please connect Web3Auth first.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:4000/api/web3auth/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        console.error("Failed to get balance");
      }
    } catch (error) {
      console.error("Error getting balance:", error);
      Alert.alert("Error", "Failed to get balance. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithOtp,
        verifyOtp,
        email,
        setEmail,
        loggedIn,
        session,
        isValidEmail,
        logout,
        address,
        balance,
        getBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {useState, useEffect} from "react";
import { Stack } from "expo-router";
import { useAuth, useAuthInit } from "@/hooks/auth";
import { useBalance } from "@/hooks/queries/useWeb3Auth";
import { useWalletStore } from "@/store/walletStore";

const RootStack = () => {
  const { address, balance } = useWalletStore();
  const { loggedIn, session, isInitialized } = useAuth();
  const [showStorybook, setShowStorybook] = useState(false);
  
  useAuthInit();
  useBalance(address, session?.access_token || "");
  console.log("balance", balance);
  console.log("my session info",session?.access_token) 
  // console.log("my loggedIn",loggedIn)

  // delay storybook render to prevent bypassing initial route
  useEffect(() => {
    setTimeout(() => {
      setShowStorybook(true);
    }, 8000);
    return () => {
      setShowStorybook(false);
    }
  }, [])

  return (
    <Stack initialRouteName={loggedIn ? "(tabs)" : "login"}>
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="otp"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={__DEV__ && showStorybook && isInitialized}>
        <Stack.Screen name="storybook" options={{ headerShown: true }} />
      </Stack.Protected>
      <Stack.Protected guard={loggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default RootStack;

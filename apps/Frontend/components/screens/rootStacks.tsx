import React from "react";
import { Stack } from "expo-router";
import { useW3SuiAuth } from "@/contexts/w3SuiAuth";
// import { useW3Auth0 } from "@/contexts/auth0Context";

const RootStacks = () => {
  const { loggedIn, loggedInAuth0 } = useW3SuiAuth();
  // const { loggedInAuth0 } = useW3Auth0();
  return (
    <Stack>
      <Stack.Protected guard={!loggedInAuth0}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: true, headerTransparent: true, headerTitle: "" }} />
      </Stack.Protected>
      <Stack.Protected guard={loggedInAuth0 || loggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default RootStacks;

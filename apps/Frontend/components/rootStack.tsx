import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const RootStack = () => {
  const { session, address } = useAuth();
  const loggedIn = session && session.user !== null ? true : false;

  console.log("my session info",session?.access_token)
  console.log("my address",address)
  return (
    <Stack>
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
      {/* <Stack.Protected guard={__DEV__}>
        <Stack.Screen name="storybook" options={{ headerShown: true }} />
      </Stack.Protected> */}
      <Stack.Protected guard={loggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default RootStack;

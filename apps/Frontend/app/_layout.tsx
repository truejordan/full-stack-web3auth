import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { Uniwind, useUniwind } from "uniwind";
import "react-native-reanimated";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "./global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

Uniwind.setTheme("dark");
console.log(Uniwind.currentTheme);
export default function RootLayout() {
  const { theme } = useUniwind();
  const pathname = usePathname();
  const isStorybookRoute = pathname === "/storybook";
  // Storybook doesn't need Auth0 or HeroUI providers
  if (isStorybookRoute) {
    return (
      <>
        <Stack>
          <Stack.Protected guard={__DEV__}>
            <Stack.Screen name="storybook" options={{ headerShown: true }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style={"auto"} />
      </>
    );
  }

  return (
    <HeroUINativeProvider>
      <Auth0Provider
        domain={"dev-pqfoyphs7qp6u38e.uk.auth0.com"}
        clientId={process.env.EXPO_PUBLIC_AUTHO_CLIENT_ID!}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
      </Auth0Provider>
      {/* <TestStacks /> */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </HeroUINativeProvider>
  );
}

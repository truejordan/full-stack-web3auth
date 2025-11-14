import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { Uniwind, useUniwind } from "uniwind";
import RootStack from "@/components/rootStack";
import "react-native-reanimated";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "../global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useThemeStore } from "@/store/useThemsStore";

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const { theme } = useUniwind();
  const { themeStore } = useThemeStore();
  useEffect(() => {
    Uniwind.setTheme(themeStore);
  }, [themeStore]);

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUINativeProvider>
          <RootStack />
          <StatusBar style={theme.includes("dark") ? "light" : "dark"} />
        </HeroUINativeProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}

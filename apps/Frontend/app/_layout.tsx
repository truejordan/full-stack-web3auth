import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { Uniwind, useUniwind } from "uniwind";
import { AuthProvider } from "@/context/AuthContext";
import RootStack from "@/components/rootStack";
import "react-native-reanimated";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "./global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export const unstable_settings = {
  anchor: "(tabs)",
};

Uniwind.setTheme("dark");
console.log(Uniwind.currentTheme);
export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <HeroUINativeProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </HeroUINativeProvider>
  );
}

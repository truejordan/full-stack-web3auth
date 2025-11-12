import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { Uniwind, useUniwind } from "uniwind";
import RootStack from "@/components/rootStack";
import "react-native-reanimated";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "./global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthInit } from "@/hooks/auth";

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();
Uniwind.setTheme("dark");
// console.log(Uniwind.currentTheme);

// function AppContent() {
//   const { theme } = useUniwind();
//   // Initialize auth listeners
//   useAuthInit();
//   return (

//       <HeroUINativeProvider>
//         <RootStack />
//         <StatusBar style={theme === "dark" ? "light" : "dark"} />
//       </HeroUINativeProvider>
//   );
// }

export default function RootLayout() {
  const { theme } = useUniwind();
  // Initialize auth listeners
  // useAuthInit();
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUINativeProvider>
        <RootStack />
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </HeroUINativeProvider>
    </QueryClientProvider>
  );
}

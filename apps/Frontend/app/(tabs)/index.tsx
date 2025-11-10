import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useUniwind, useResolveClassNames, withUniwind } from "uniwind";
import OtpInput from "@/components/ui/otpInput";
import { useState } from "react";
import { TextField } from "heroui-native";
import StyledSafeAreaView from "@/components/ui/StyledSafeAreaView";
import { Link } from "expo-router";
import { Button } from "heroui-native";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const { theme } = useUniwind();
  const [otp, setOtp] = useState("");
  const { logout, session } = useAuth();

  const connectw3atest = async (idToken: string) =>{
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

  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledSafeAreaView className="flex-1 items-center justify-center bg-background gap-4">
        <Text className="text-foreground">{theme}</Text>

        <View className="flex flex-col gap-4">
          <OtpInput onChangeOtp={(otp) => setOtp(otp)} initial="123456" />
        </View>

        <Link href="./storybook" className="text-blue-500">
          Storybook
        </Link>
          <Button
            variant="primary"
            className="w-72 bg-warning"
            onPress={() => logout()}
          >
            <Button.Label>Logout</Button.Label>
          </Button>
          <Button
            variant="primary"
            className="w-72 bg-warning"
            onPress={() => session?.access_token && connectw3atest(session.access_token)}
          >
            <Button.Label>Connect Web3Auth</Button.Label>
          </Button>
      </StyledSafeAreaView>
    </TouchableWithoutFeedback>
  );
}

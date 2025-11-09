import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
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
  const { logout } = useAuth();
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
      </StyledSafeAreaView>
    </TouchableWithoutFeedback>
  );
}

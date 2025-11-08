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

export default function HomeScreen() {
  const { theme } = useUniwind();
  const [otp, setOtp] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledSafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">{theme}</Text>
        {/* <View className="flex-row w-full h-20 bg-red-500"> */}

        <OtpInput onChangeOtp={(otp) => setOtp(otp)} initial="123456" />
        {/* </View> */}

        {/* <View className="flex w-full justify-center items-center"> */}
        <Link href="./storybook" className="text-blue-500">Storybook</Link>
        <View className="flex-row gap-2">

        <TextField className="w-12">
          <TextField.Input
            value={otp}
            onChangeText={(text) => setOtp(text)}
            className="h-12 rounded-2xl border-2"
            placeholder="Enter OTP"
            colors={{
              blurBackground: "#eff6ff", // Background when not focused
              focusBackground: "#dbeafe", // Background when focused
              blurBorder: "#2563eb", // Border when not focused
              focusBorder: "#1d4ed8", // Border when focused
              errorBorder: "#dc2626", // Border when invalid/error
            }}
            />
        </TextField>
        <TextField className="w-12">
          <TextField.Input
            value={otp}
            onChangeText={(text) => setOtp(text)}
            className="h-12 rounded-2xl border-2"
            placeholder="Enter OTP"
            colors={{
              blurBackground: "#eff6ff", // Background when not focused
              focusBackground: "#dbeafe", // Background when focused
              blurBorder: "#2563eb", // Border when not focused
              focusBorder: "#1d4ed8", // Border when focused
              errorBorder: "#dc2626", // Border when invalid/error
            }}
            />
        </TextField>
            </View>
        {/* </View> */}
      </StyledSafeAreaView>
    </TouchableWithoutFeedback>
  );
}

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import OtpInput from "@/components/ui/otpInput";
import { Button } from "heroui-native";

const Otp = () => {
  const { verifyOtp, email, signInWithOtp } = useAuth();
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleResendCode = async () => {
    // setIsResending(true);
    if (!email) return;
    await signInWithOtp(email, true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center pt-14 pb-8 bg-background gap-16 justify-center">
        <View className="flex flex-col items-center gap-2">
          <Text className="text-2xl font-bold text-foreground">
            We sent you an email
          </Text>
          <Text className="text-sm text-muted-foreground">
            Enter the code sent to {email}
          </Text>
        </View>
        <View className="flex flex-col gap-4">
          <OtpInput initial={otpCode} onChangeOtp={setOtpCode} otpLength={6} />
          <Button
            className=" bg-red-500 "
            size="md"
            onPress={() => verifyOtp(otpCode)}
          >
            <Button.Label>Verify</Button.Label>
          </Button>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text className="flex flex-row items-center gap-2 text-sm text-muted-foreground align-center">
            Did not receive the code?{" "}
          </Text>
          <TouchableOpacity
            disabled={countdown > 0}
            onPress={() => handleResendCode()}
          >
            <Text
              className={`text-sm ${countdown > 0 ? "text-danger" : "text-warning"}`}
            >
              {countdown > 0 ? `${countdown}` : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Otp;

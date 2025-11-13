import {
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
import { useAuth } from "@/hooks/auth";
import { useConnectWeb3Auth } from "@/hooks/queries/useWeb3Auth";

export default function HomeScreen() {
  const { theme } = useUniwind();
  const [otp, setOtp] = useState("");
  const { logout, getFreshTokenForWeb3Auth, session } = useAuth();
  const connectWeb3Auth = useConnectWeb3Auth();

  const connectw3atest = async () => {
    // const freshToken = await getFreshTokenForWeb3Auth(); // may not need, a general refresh function maybe better
    if (session?.access_token) {
      connectWeb3Auth.mutateAsync(session.access_token);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledSafeAreaView className="flex-1 items-center justify-center bg-background gap-4">
        <Text className="text-foreground">{theme}</Text>

        <View className="flex flex-col gap-4">
          <OtpInput initial={otp} onChangeOtp={setOtp} />
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
          onPress={() => connectw3atest()}
        >
          <Button.Label>Connect Web3Auth</Button.Label>
        </Button>
      </StyledSafeAreaView>
    </TouchableWithoutFeedback>
  );
}

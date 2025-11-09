import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Keyboard } from "react-native";
import HuiImage from "@/components/hui-image";
import { TextField } from "heroui-native";
import { Button } from "heroui-native";
import { Divider } from "heroui-native";
import { HuiText } from "@/components/hui-text";
import HuiExternalLink from "@/components/hui-external-link";
// import HuiExternalLink from '@/components/hui-external-link'
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { signInWithOtp, email, setEmail } = useAuth();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center pt-14 pb-8 bg-background">
        <View className="flex-1 w-full grow-[2} items-center gap-8 pt-32 pb-30">
          <HuiImage
            className="w-24 h-24 m-8"
            source="https://www.d3jordan.com/d3j-logo-new.svg"
            contentFit="contain"
          />
          <TextField className="flex gap-4 items-center w-72">
            <TextField.Label>Email Login</TextField.Label>
            <TextField.Input
              className=" h-[48px] px-4 rounded-xl"
              placeholder="Enter your email"
              onChangeText={setEmail}
            />
            <TextField.InputEndContent>
              <Button
                variant="primary"
                className="w-72 bg-warning"
                onPress={() => email && signInWithOtp(email)}
              >
                <Button.Label>Login</Button.Label>
              </Button>
            </TextField.InputEndContent>
            <TextField.ErrorMessage>
              This field is required
            </TextField.ErrorMessage>
          </TextField>
          <View className="flex flex-row gap-8 items-center justify-center w-64 overflow-hidden">
            <Divider
              orientation="horizontal"
              variant="thin"
              className=" w-full bg-foreground"
            />
            <HuiText className="text-lg">or</HuiText>
            <Divider
              orientation="horizontal"
              variant="thin"
              className=" w-full bg-foreground"
            />
          </View>
          <View className="flex flex-row gap-4">
            <Button
              className="w-20"
              // onPress={() => login(LOGIN_PROVIDER.JWT, "google-oauth2")}
              //   onPress={() => socialAuthorize("google-oauth2")}/
            >
              <FontAwesome6 name="google" size={24} color="black" />
            </Button>
            <Button
              className="w-20"
              // onPress={() => login(LOGIN_PROVIDER.JWT, "Twitter")}
              //   onPress={() => socialAuthorize("Twitter")}
            >
              <FontAwesome6 name="x-twitter" size={24} color="black" />
            </Button>
            <Button
              className="w-20"
              // onPress={() => login(LOGIN_PROVIDER.JWT, "Apple")}
              //   onPress={() => socialAuthorize("Apple")}
            >
              <FontAwesome6 name="apple" size={24} color="black" />
            </Button>
          </View>
          <HuiExternalLink
            href="https://x.com/0xPlayer1"
            className="text-white"
          >
            <View className="flex flex-col items-center gap-2">
              <HuiText className=" text-xs">Follow me on X</HuiText>
              <HuiText className="text-cyan-400">@0xPlayer1</HuiText>
            </View>
          </HuiExternalLink>
          {/* Use auth console to see sign in logs */}
          {/* <View className="w-full p-4">
              <AuthConsole />
            </View> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

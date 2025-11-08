import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "heroui-native";
import { useW3SuiAuth } from "@/contexts/w3SuiAuth";
import AuthConsole from "@/components/auth/AuthConsole";

export default function FunctionsScreen() {
  const {
    uiConsole,
    getAddress,
    getUserInfo,
    getChainId,
    getBalance,
    requestFaucet,
    sendTransaction,
    signMessage,
    launchWalletServices,
    requestSignature,
    logout,
    clearAuth0Credentials,
  } = useW3SuiAuth();
  // const AUTH0_SCHEME = 'com.youridentifier.auth3login';

  const loggedInView = (
    <View className="flex-1 items-center gap-4 pb-24 pt-8">
      <Button size="sm" onPress={() => uiConsole(getUserInfo())}>
        <Button.Label className="w-full">Get User Info</Button.Label>
      </Button>
      <Button size="sm" onPress={() => getChainId()}>
        <Button.Label className="w-full">Get Chain ID</Button.Label>
      </Button>
      <Button size="sm" onPress={() => getAddress()}>
        <Button.Label className="w-full">Get Accounts</Button.Label>
      </Button>
      <Button size="sm" onPress={() => getBalance()}>
        <Button.Label className="w-full">Get Balance</Button.Label>
      </Button>
      <Button size="sm" onPress={() => requestFaucet()}>
        <Button.Label className="w-full">Request Faucet</Button.Label>
      </Button>
      <Button
        size="sm"
        onPress={() =>
          sendTransaction(
            "0x41d4d47f7e2a9169f514ee4af2018bf486d53a347899ad21e16ba5ddc24e7fe3", // use input for recipient address
            15.2
          )
        }
      >
        <Button.Label className="w-full">Send 0.2 Sui</Button.Label>
      </Button>
      <Button size="sm" onPress={() => signMessage()}>
        <Button.Label className="w-full">Sign Message</Button.Label>
      </Button>

      <Button size="sm" onPress={() => launchWalletServices()}>
        <Button.Label className="w-full">Show Wallet UI</Button.Label>
      </Button>
      <Button size="sm" onPress={() => requestSignature()}>
        <Button.Label className="w-full">
          Request Signature from Wallet Services
        </Button.Label>
      </Button>
      <Button
        variant="danger"
        size="sm"
        onPress={() => clearAuth0Credentials()}
      >
        <Button.Label className="w-full">Log Out</Button.Label>
      </Button>
    </View>
  );
  return (
    <SafeAreaView className="flex-1  p-8">
      <AuthConsole />
      <ScrollView
        className="flex-1 h-full w-full gap-4"
        showsVerticalScrollIndicator={false}
      >
        {loggedInView}
      </ScrollView>
    </SafeAreaView>
  );
}

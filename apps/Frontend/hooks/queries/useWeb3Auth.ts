import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { web3AuthApi } from "@/lib/tanstack/web3auth";
import { Alert } from "react-native";
import { useWalletStore } from "@/store/walletStore";
import * as SecureStore from "expo-secure-store";

const ADDRESS_STORAGE_KEY = "WALLET_ADDRESS";

/**
 * Connect to Web3Auth (mutation - changes state)
 */
export const useConnectWeb3Auth = () => {
  const queryClient = useQueryClient();
  const { setAddress } = useWalletStore();

  return useMutation({
    mutationFn: (idToken: string) => web3AuthApi.connect(idToken),
    onSuccess: async (data) => {
      if (data.address) {
        setAddress(data.address);
        await SecureStore.setItemAsync(ADDRESS_STORAGE_KEY, data.address);
        // Invalidate balance query so it refetches with new address
        queryClient.invalidateQueries({ queryKey: ["balance", data.address] });
        console.log("web3auth connected", data);
      }
    },
    onError: (error: Error) => {
      Alert.alert("Web3Auth Error", error.message);
    },
  });
};

/**
 * Get wallet balance (query - reads data)
 * Automatically refetches when address changes
 */
export const useBalance = (address: string | undefined, idToken: string) => {
  const { setBalance } = useWalletStore();
  const {data, error}= useQuery({
    queryKey: ["balance", address, idToken],
    queryFn: () => web3AuthApi.getBalance(address!, idToken),
    enabled: !!address && !!idToken, // Only run if address exists
    staleTime: 5 * 1000, // Consider fresh for 5 seconds
    refetchInterval: 5 * 1000, // Refetch every 5 seconds
  });

  if (error) {
    console.log("Error getting balance:", error.message);
  }

  useEffect(() => {
    if (data) {
      setBalance(data.balance);
    }
  }, [data, setBalance]);
};

/**
 * Transfer tokens (mutation)
 */
export const useTransfer = () => {
  const queryClient = useQueryClient();
  const { address } = useWalletStore();

  return useMutation({
    mutationFn: ({
      recipient,
      amount,
      idToken,
    }: {
      recipient: string;
      amount: number;
      idToken: string;
    }) => web3AuthApi.transfer(recipient, amount, idToken),
    onSuccess: () => {
      // Invalidate balance after transfer to refetch
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["balance", address] });
      }
      console.log("Success", "Transaction sent successfully");
    },
    onError: (error: Error) => {
      console.log("Transfer Error", error.message);
    },
  });
};

export const useFaucet = () => {
  const queryClient = useQueryClient();
  const { address } = useWalletStore();

  return useMutation({
    mutationFn: ({ idToken }: { idToken: string }) => web3AuthApi.faucet(address!, idToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance", address] });
      console.log("Success", "SUI requested from faucet");
    },
    onError: (error: Error) => {
      console.error("Faucet Error", error.message);
    },
  });
};
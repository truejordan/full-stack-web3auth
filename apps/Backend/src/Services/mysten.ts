import { SuiConfigType } from "../config/suiConfig";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient, getFullnodeUrl, CoinBalance } from "@mysten/sui/client";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";

type SuiNetwork = "mainnet" | "testnet" | "devnet" | "localnet";

export const suiRPC = () => {
  return new SuiClient({
    url: getFullnodeUrl(SuiConfigType.displayName.devnet as SuiNetwork), //choose mainnet for production
  });
};

export const getSuiKeyPair = (privateKey: Uint8Array): Ed25519Keypair => {
  return Ed25519Keypair.fromSecretKey(privateKey);
};

export const balance = (balance: CoinBalance) => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

export const getSuiBalance = async (address: string) => {
  const rpc = suiRPC();
  const res = await rpc.getBalance({ owner: address });
  return balance(res);
};

export const sendTransaction = async (
  recipient: string,
  amount: number,
  keyPair: Ed25519Keypair
) => {
  if (!recipient || amount <= 0 || !keyPair) {
    throw new Error("Invalid input parameters");
  }
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [
    tx.pure.u64(amount * Number(MIST_PER_SUI)),
  ]);

  tx.transferObjects([coin], tx.pure.address(recipient));
//   const kp = getSuiKeyPair(privateKey);
  const result = await suiRPC().signAndExecuteTransaction({
    transaction: tx,
    signer: keyPair,
  });
  return { digest: result.digest, amount: amount, recipient: recipient };
};

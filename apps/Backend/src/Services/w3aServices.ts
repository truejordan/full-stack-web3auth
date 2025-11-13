import { web3authProvider } from "../config/web3Auth";
import type { IBaseProvider } from "@web3auth/no-modal";
import { getSuiKeyPair } from "./mysten";

const web3auth = web3authProvider;
const authConnectionId =  "express-custom-jwt"; // web3auth Auth Connection ID for custom connection

export const connectToWeb3Auth = async (idToken: string) => {
  const session = await web3auth.connect({
    authConnectionId,
    idToken,
  });
  return session.provider; // this returns the provider to get the private key
};

export const getPrivateKey = async (provider: IBaseProvider<any>) => {
  const privateKey = await provider.request({ method: "private_key" });
  return privateKey as string;
};

export const getKeyPair = async <T = any>(
  provider: IBaseProvider<any>,
  keyPairFn: (privateKey: Uint8Array) => T
): Promise<T> => {
  const privateKey = await getPrivateKey(provider);
  const privateKeyUint8Array = new Uint8Array(
    privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
  );

  const keyPair = keyPairFn(privateKeyUint8Array);
  return keyPair;
};


/**
 * Reusable service: Connect to Web3Auth and get wallet info
 * @param idToken - Web3Auth JWT token
 * @param includePrivateKey - Whether to include private key in response (default: false)
 * @returns Object with provider, keyPair, and address (and optionally privateKey)
 */
export const getWeb3AuthWallet = async (
  idToken: string,
  includePrivateKey: boolean = false
) => {
  const provider = await connectToWeb3Auth(idToken);
  const keyPair = await getKeyPair(provider, getSuiKeyPair);
  const address = keyPair.toSuiAddress();

  const result: {
    provider: IBaseProvider<any>;
    keyPair: ReturnType<typeof getSuiKeyPair>;
    address: string;
    privateKey?: string;
  } = {
    provider,
    keyPair,
    address,
  };

  if (includePrivateKey) {
    result.privateKey = await getPrivateKey(provider);
  }

  return result;
};
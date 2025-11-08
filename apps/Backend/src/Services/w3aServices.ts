import { web3authProvider } from "../config/web3Auth";
import type { IBaseProvider } from "@web3auth/no-modal";

const web3auth = web3authProvider;

const authConnectionId = "3xl-sub-auth";

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

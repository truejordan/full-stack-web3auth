import { Web3Auth, } from "@web3auth/node-sdk";
import { SuiConfigType } from "../config/suiConfig";
import { CHAIN_NAMESPACES, IBaseProvider, WEB3AUTH_NETWORK } from "@web3auth/no-modal";

const web3auth = new Web3Auth({
    clientId: process.env['WEB3AUTH_CLIENT_ID'] as string,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    defaultChainId: SuiConfigType.chainId.devnet,
    enableLogging: true,
});

const initWeb3Auth = async () => {
  await web3auth.init();
};

// initWeb3Auth();

const connectToWeb3Auth = async (authConnectionId: string, idToken: string) => {
    initWeb3Auth()
  await web3auth.connect({
    authConnectionId,
    idToken,
  });
};
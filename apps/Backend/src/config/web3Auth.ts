import { Web3Auth, } from "@web3auth/node-sdk";
import { SuiConfigType } from "./suiConfig";
import { CHAIN_NAMESPACES, IBaseProvider, WEB3AUTH_NETWORK } from "@web3auth/no-modal";

export const web3authProvider = new Web3Auth({
    clientId: process.env['WEB3AUTH_CLIENT_ID'] as string,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    defaultChainId: SuiConfigType.chainId.devnet,
    enableLogging: true,
});

export const initWeb3Auth = async () => {
  await web3authProvider.init();
};

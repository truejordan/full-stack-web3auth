import { handleApiResponse } from "@/utils/responseHandler";
const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

interface ConnectResponse {
  success: boolean;
  message: string;
  address: string;
}

interface BalanceResponse {
  success: boolean;
  balance: number;
}

interface TransferResponse {
  success: boolean;
  message: string;
  txHash?: string;
}

interface FaucetResponse {
  success: boolean;
  message: string;
}

export const web3AuthApi = {
  connect: async (idToken: string): Promise<ConnectResponse> => {
    const response = await fetch(`${API_BASE_URL}/web3auth/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ idToken }),
    });
    
    return handleApiResponse<ConnectResponse>(response, "Failed to connect to Web3Auth");
  },

  getBalance: async (address: string, idToken: string): Promise<BalanceResponse> => {
    const response = await fetch(`${API_BASE_URL}/web3auth/balance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ address }),
    });
    return handleApiResponse<BalanceResponse>(response, "Failed to get balance");
  },

  transfer: async (
    recipient: string,
    amount: number,
    idToken: string
  ): Promise<TransferResponse> => {
    const response = await fetch(`${API_BASE_URL}/web3auth/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ recipient, amount, idToken }),
    });

    return handleApiResponse<TransferResponse>(response, "Failed to transfer");
  },

  faucet: async (address: string, idToken: string): Promise<FaucetResponse> => {
    const response = await fetch(`${API_BASE_URL}/web3auth/faucet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ address }),
    });
    return handleApiResponse<FaucetResponse>(response, "Failed to request faucet");
  },
};

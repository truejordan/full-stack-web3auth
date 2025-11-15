import express from "express";
import {
  connectToWeb3Auth,
  getKeyPair,
  getPrivateKey,
} from "../Services/w3aServices";
import {
  getSuiKeyPair,
  getSuiBalance,
  suiRPC,
  sendTransaction,
  requestSuiFromFaucet,
} from "../Services/mysten";
import { checkJwt } from "../middleware/jwt";
import { getWeb3AuthWallet } from "../Services/w3aServices";
import { mintW3Jwt } from "../Services/tokenService";

const router = express.Router();

router.get("/test", async (req, res) => {
  res.json({ success: true, message: "web3auth route active" });
});

router.post("/connect", checkJwt, async (req, res): Promise<void> => {
  console.log("🔐 Auth check result:", {
    verified: !!req.auth,
    userId: req.auth?.payload?.sub,
    email: req.auth?.payload?.["email"],
  });

  try {
    const w3Token = await mintW3Jwt(req);
    console.log("🔐 W3 Token minted:", w3Token);

    if (!w3Token) {
      res.status(400).json({ error: "Failed to mint W3 JWT" });
      return;
    }
    const { address, privateKey } = await getWeb3AuthWallet(w3Token, true);
    res.json({
      success: true,
      address: address,
      pkStatus: privateKey ? "success" : "failed",
    });
  } catch (error) {
    console.error("Error connecting to Web3Auth:", error);
    res.status(500).json({
      error: "Failed to connect to Web3Auth",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/chainId", async (_, res): Promise<void> => {
  try {
    const rpc = suiRPC();
    const chainId = await rpc.getChainIdentifier();
    res.json({ success: true, chainId: chainId });
  } catch (error) {
    console.error("Error getting chain identifier:", error);
    res.status(500).json({
      error: "Failed to get chain identifier",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/balance", async (req, res): Promise<void> => {
  const { address } = req.body;
  if (!address) {
    res.status(400).json({ error: "Address is required" });
    return;
  }
  try {
    const balance = await getSuiBalance(address);
    res.json({ success: true, balance: balance });
  } catch (error) {
    console.error("Error getting SUI balance:", error);
    res.status(500).json({
      error: "Failed to get SUI balance",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/transfer", checkJwt, async (req, res): Promise<void> => {
  const { recipient, amount } = req.body;
  if (!recipient || amount <= 0) {
    res.status(400).json({ error: "Invalid recipient or amount" });
    return;
  }
  try {
    const w3Token = await mintW3Jwt(req);
    console.log("🔐 W3 Token minted:", w3Token);

    if (!w3Token) {
      res.status(400).json({ error: "Failed to mint W3 JWT" });
      return;
    }
    const provider = await connectToWeb3Auth(w3Token);
    const keyPair = await getKeyPair(provider, getSuiKeyPair);
    const transaction = await sendTransaction(recipient, amount, keyPair);
    res.json({ success: true, transaction: transaction });
  } catch (error) {
    console.error("Error sending transaction:", error);
    res.status(500).json({
      error: "Failed to send transaction",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post('/faucet', checkJwt, async (req, res): Promise<void> =>{
  // request from faucet
  try{
  await requestSuiFromFaucet(req.body.address);
  res.json({ success: true, message: "SUI requested from faucet" });
  } catch (error) {
    console.error("Error requesting SUI from faucet:", error);
    res.status(500).json({
      error: "Failed to request SUI from faucet",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
})

export default router;

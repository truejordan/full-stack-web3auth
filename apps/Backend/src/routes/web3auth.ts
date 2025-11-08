import express from "express";
import {
  connectToWeb3Auth,
  getPrivateKey,
  getKeyPair,
} from "../Services/w3aServices";
import {
  getSuiKeyPair,
  getSuiBalance,
  suiRPC,
  sendTransaction,
} from "../Services/mysten";

const router = express.Router();

router.get("/test", async (req, res) => {
  res.json({ success: true, message: "web3auth route active" });
});

router.post("/connect", async (req, res): Promise<void> => {
  const { idToken } = req.body;

  // Validate input
  if (!idToken) {
    res.status(400).json({ error: "idToken is required" });
    return;
  }

  try {
    const provider = await connectToWeb3Auth(idToken);
    const keyPair = await getKeyPair(provider, getSuiKeyPair);
    const address = keyPair.toSuiAddress();
    res.json({
      success: true,
      message: "Connected to Web3Auth successfully",
      address: address,
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

router.post("/transfer", async (req, res): Promise<void> => {
  const { recipient, amount, idToken } = req.body;
  if (!recipient || amount <= 0) {
    res.status(400).json({ error: "Invalid recipient or amount" });
    return;
  }
  try {
  const provider = await connectToWeb3Auth(idToken);
  const keyPair = await getKeyPair(provider, getSuiKeyPair);
  const transaction = await sendTransaction(recipient, amount, keyPair );
  res.json({success: true, transaction: transaction});
  } catch (error) {
    console.error("Error sending transaction:", error);
    res.status(500).json({
      error: "Failed to send transaction",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

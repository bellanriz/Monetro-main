import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";
import { ethers } from "ethers";
import admin from "firebase-admin";

const router = Router();

// MonetroToken ABI (only the functions we need)
const TOKEN_ABI = [
  "function mintReward(address to, uint256 amount, string reason) external",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

// Initialize blockchain connection
function getContract() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.MONETRO_TOKEN_ADDRESS;

  if (!privateKey || !contractAddress) {
    throw new Error("Missing PRIVATE_KEY or MONETRO_TOKEN_ADDRESS in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, TOKEN_ABI, wallet);
}

// Reward amounts (in tokens) for different actions
const REWARD_AMOUNTS: Record<string, number> = {
  savings_deposit: 10, // Kid deposits into savings
  goal_completed: 50, // Kid completes a savings goal
  under_budget: 5, // Kid stays under weekly budget
  streak_weekly: 20, // 7-day saving streak
};

// POST /api/rewards/mint - Mint reward tokens for a kid
router.post("/mint", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidId, action, walletAddress } = req.body;

    if (!kidId || !action || !walletAddress) {
      return res.status(400).json({ error: "kidId, action, and walletAddress are required" });
    }

    // Verify the requester is the parent of the kid (or the kid themselves)
    if (kidId !== uid) {
      const kidDoc = await adminDb.collection("users").doc(kidId).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
        return res.status(403).json({ error: "Not authorized to mint rewards for this user" });
      }
    }

    // Get reward amount
    const rewardAmount = REWARD_AMOUNTS[action];
    if (!rewardAmount) {
      return res.status(400).json({ error: `Unknown action: ${action}. Valid: ${Object.keys(REWARD_AMOUNTS).join(", ")}` });
    }

    // Mint tokens on-chain
    const contract = getContract();
    const amount = ethers.parseUnits(rewardAmount.toString(), 18);
    const reason = `Monetro reward: ${action}`;

    const tx = await contract.mintReward(walletAddress, amount, reason);
    const receipt = await tx.wait();

    // Record in Firestore
    await adminDb.collection("rewards").add({
      userId: kidId,
      action,
      amount: rewardAmount,
      walletAddress,
      txHash: receipt.hash,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: `Minted ${rewardAmount} MNTR tokens`,
      txHash: receipt.hash,
      etherscanUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
      amount: rewardAmount,
    });
  } catch (error: any) {
    console.error("Mint reward error:", error);
    res.status(500).json({ error: "Failed to mint reward tokens" });
  }
});

// GET /api/rewards/balance/:walletAddress - Get token balance
router.get("/balance/:walletAddress", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const contract = getContract();
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    const formatted = ethers.formatUnits(balance, decimals);

    res.json({
      walletAddress,
      balance: formatted,
      symbol: "MNTR",
    });
  } catch (error: any) {
    console.error("Get balance error:", error);
    res.status(500).json({ error: "Failed to get token balance" });
  }
});

// GET /api/rewards/history - Get reward history for a user
router.get("/history", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidId } = req.query;

    const targetId = kidId || uid;

    // If viewing kid's history, verify parent relationship
    if (kidId && kidId !== uid) {
      const kidDoc = await adminDb.collection("users").doc(kidId as string).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
        return res.status(403).json({ error: "Not authorized" });
      }
    }

    const snapshot = await adminDb
      .collection("rewards")
      .where("userId", "==", targetId)
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const rewards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ rewards });
  } catch (error: any) {
    console.error("Get reward history error:", error);
    res.status(500).json({ error: "Failed to fetch reward history" });
  }
});

export default router;

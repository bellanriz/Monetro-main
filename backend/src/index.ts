import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import usersRouter from "./routes/users";
import transactionsRouter from "./routes/transactions";
import savingsRouter from "./routes/savings";
import notificationsRouter from "./routes/notifications";
import aiRouter from "./routes/ai";
import invitesRouter from "./routes/invites";
import allowanceRouter from "./routes/allowance";
import rewardsRouter from "./routes/rewards";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // --- Middleware ---
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "10mb" })); // Larger limit for receipt image uploads

  // --- Health check ---
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- API Routes ---
  app.use("/api/users", usersRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/savings", savingsRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/invites", invitesRouter);
  app.use("/api/allowance", allowanceRouter);
  app.use("/api/rewards", rewardsRouter);

  // Static serving removed — frontend deployed separately on Vercel

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Monetro backend running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { requestLogger } from "./middleware/logger";
import { initWeb3Auth } from "./config/web3Auth";

const app = express();
const PORT = process.env["PORT"] || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "3XL Backend API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test database: http://localhost:${PORT}/api/test/test-db`);
  console.log(`🔗 Web3Auth: http://localhost:${PORT}/api/web3auth/test`);
  // Initialize Web3Auth
  try {
    await initWeb3Auth();
    console.log("✅ Web3Auth initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Web3Auth:", error);
  }
});

export default app;

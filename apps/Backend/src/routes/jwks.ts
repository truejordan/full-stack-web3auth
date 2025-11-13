import express from "express";
import { jwks } from "../config/jwks";

const router = express.Router();

router.get("/jwks.json", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache");
  res.json(jwks);
});

export default router;

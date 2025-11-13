import express from "express";
import { jwks } from "../config/jwks";

const router = express.Router();

router.get("/.well-known/jwks.json", async (req, res) => {
  res.json(jwks);
});

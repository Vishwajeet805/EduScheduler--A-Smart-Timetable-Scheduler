import serverless from "serverless-http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple API endpoints
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export const handler = serverless(app);

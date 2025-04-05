import express from "express";

const app = express();

app.get("/health-check", (req, res) => {
  res.json({ message: "hello world" });
});

export default app;

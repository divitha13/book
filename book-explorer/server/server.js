const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "..", "data", "feedback.json");

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, ".."))); // serves the website too

async function readFeedback() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

app.get("/feedback", async (req, res) => {
  const items = await readFeedback();
  res.json(items.slice(-50).reverse()); // newest first, max 50
});

app.post("/feedback", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !message) return res.status(400).json({ error: "Name and message are required." });
  if (name.length > 60 || message.length > 500) return res.status(400).json({ error: "Input is too long." });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Email looks invalid." });

  const items = await readFeedback();
  items.push({ id: Date.now(), name, email, message, createdAt: new Date().toISOString() });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));

import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

// Proxy to Google Apps Script
app.post("/api/proxy", async (req, res) => {
  if (!scriptUrl) {
    return res.status(500).json({ error: "GOOGLE_APPS_SCRIPT_URL is not set" });
  }
  
  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Google Apps Script" });
  }
});

app.get("/api/proxy", async (req, res) => {
  if (!scriptUrl) {
    return res.status(500).json({ error: "GOOGLE_APPS_SCRIPT_URL is not set" });
  }
  
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const response = await fetch(`${scriptUrl}?${params.toString()}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Google Apps Script" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

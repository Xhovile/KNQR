import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
  });

  app.use(limiter);
  app.use(express.json());

  // Mindset Affirmation AI API endpoint
  app.post("/api/conquer-mindset", async (req, res) => {
    const { challenge, energy } = req.body;
    if (!challenge) {
      return res.status(400).json({ error: "Challenge description is required." });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("Gemini API key is missing or not configured.");
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a powerful, highly sophisticated, and evocative self-improvement affirmation for a luxury lifestyle and fashion brand named KNQR (founded by Malawian entrepreneur and musician Hayze Engola, promoting ambition, confidence, and self-improvement). 
        
        The user is facing this obstacle or chasing this ambition: "${challenge}". 
        The requested mindset vibe is "${energy}".
        
        Guidelines:
        - Output a single, premium, cohesive paragraph (no longer than 3 sentences).
        - Do NOT use cheesy standard motivation slogans (like "be a beast", "crush your goals", "boss up"). Use deeply elegant, smart, sophisticated, and polished language.
        - Connect the concept of conquering limits, inner strength, and personal excellence.
        - Do not place double quotation marks around the entire output. Just provide the affirmation directly.`,
      });

      const affirmation = response.text?.trim() || "";
      res.json({ affirmation });
    } catch (err: any) {
      console.warn("Gemini Service Unavailable: ", err.message);
      
      // Sophisticated hand-crafted fallbacks so the service is bulletproof
      const fallbacks: Record<string, string> = {
        "Bold Conqueror": `Let the friction of "${challenge}" become the fuel for your discipline. True excellence is forged under pressure—stand tall, execute with unwavering conviction, and conquer from within.`,
        "Calm Focus": `Breathe through the turbulence of "${challenge}". Still your mind, align your focus, and move with deliberate poise. True resilience is silent, elegant, and completely unstoppable.`,
        "Entrepreneur Ambition": `Every constraint embedded in "${challenge}" is a blueprint for your next strategic pivot. Build with resourcefulness, honor Malawian creativity, and let your ambition echo globally.`,
      };
      const fallbackAffirmation = fallbacks[energy] || fallbacks["Bold Conqueror"];
      res.json({ affirmation: fallbackAffirmation, fallback: true });
    }
  });

  // Vite Middleware Setup
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
    console.log(`[KNQR SERVER] Live at http://localhost:${PORT}`);
  });
}

startServer();

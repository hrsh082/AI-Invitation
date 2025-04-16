import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3300;

const API_KEY = "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"; // OpenRouter key

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
  res.send("server is working!");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided." });
  }

  console.log("🟢 Prompt received:", message);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:5500",
        "X-Title": "InvitationAI Project"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // Changed to a valid model
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      console.log("✅ AI Reply:", reply);
      res.json({ reply });
    } else {
      console.log("⚠️ No choices in AI response:", data);
      res.json({ reply: "No reply from AI." });
    }
  } catch (err) {
    console.error("❌ OpenRouter Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`🚀 OpenRouter AI backend running at http://localhost:${port}`);
});

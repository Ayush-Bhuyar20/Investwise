// src/routes/aiStockPicksRoutes.js
const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { calculateRiskProfile } = require("../services/riskEngine");
const { syncAIStocks } = require("../services/aiStockSync");

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const formData = req.body;
    if (!formData) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // 1) Use your existing risk engine
    const riskResult = calculateRiskProfile(formData);
    const { riskProfile, allocation, meta } = riskResult;

    const userContext = {
      riskProfile,
      allocation,
      age: meta?.factors?.age,
      income: meta?.factors?.income,
      investmentHorizon: meta?.factors?.investmentHorizon,
      emergencyFund: meta?.factors?.emergencyFund,
      behaviourOnDrawdown: meta?.factors?.marketDropResponse,
    };

    // 2) Ask AI for STOCK PICKS in strict JSON
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a professional Indian equity research assistant. You output strict JSON only.",
        },
        {
          role: "user",
          content: [
            "User profile:",
            JSON.stringify(userContext, null, 2),
            "",
            "Task:",
            "- Pick 6–8 liquid, widely followed Indian stocks from NSE or BSE.",
            "- For each, return symbol (without .NS/.BO), exchange (NSE/BSE), name, roughRiskBucket (low/medium/high), role and rationale.",
            "",
            "JSON shape:",
            "{",
            "  \"stocks\": [",
            "     {",
            "       \"symbol\": \"RELIANCE\",",
            "       \"exchange\": \"NSE\",",
            "       \"name\": \"Reliance Industries Ltd\",",
            "       \"roughRiskBucket\": \"medium\",",
            "       \"role\": \"core compounder\",",
            "       \"rationale\": \"...\"",
            "     }",
            "  ],",
            "  \"summary\": \"...\",",
            "  \"disclaimer\": \"...\"",
            "}",
            "",
            "Respond with PURE JSON only.",
          ].join("\n"),
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse AI JSON:", raw);
      return res
        .status(500)
        .json({ error: "AI returned invalid JSON", rawResponse: raw });
    }

    const { stocks = [], summary, disclaimer } = parsed;
    if (!Array.isArray(stocks) || stocks.length === 0) {
      return res.status(500).json({
        error: "AI did not return any stocks",
        raw: parsed,
      });
    }

    // 3) 🔥 Sync AI picks with DB + Yahoo and get enriched stocks
    const enrichedStocks = await syncAIStocks(stocks);

    // If for some reason none could be enriched, still return something
    if (!enrichedStocks.length) {
      console.warn(
        "syncAIStocks returned empty array, falling back to raw AI stocks"
      );
    }

    // 4) Final response to frontend
    return res.json({
      riskProfile,
      allocation,
      aiSummary: summary,
      aiDisclaimer: disclaimer,
      // important: send enriched stocks if available, else raw fallback
      aiStocks: enrichedStocks.length ? enrichedStocks : stocks,
    });
  } catch (err) {
    console.error("Error in /api/ai-stock-picks:", err.message);
    res.status(500).json({ error: "AI stock picker failed" });
  }
});

module.exports = router;

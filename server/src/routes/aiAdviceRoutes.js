// src/routes/aiAdviceRoutes.js
const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const Stock = require("../models/Stock");
const { calculateRiskProfile } = require("../services/riskEngine");

dotenv.config();

const router = express.Router();

// Initialise OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Helper: build a stock query aligned with risk profile
 */
function buildStockQueryForRisk(riskProfile) {
  const query = {};
  let sort = {};

  if (riskProfile === "Conservative") {
    query.riskBucket = "low";
    query.$and = [
      { $or: [{ beta: { $lte: 1.05 } }, { beta: { $exists: false } }] },
      { $or: [{ debtToEquity: { $lte: 1.0 } }, { debtToEquity: { $exists: false } }] },
    ];
    sort = {
      dividendYield: -1,
      peRatio: 1,
    };
  } else if (riskProfile === "Aggressive") {
    query.riskBucket = { $in: ["medium", "high"] };
    sort = {
      profitMargin: -1,
      peRatio: 1,
    };
  } else {
    // Moderate
    query.riskBucket = { $in: ["low", "medium"] };
    sort = {
      peRatio: 1,
    };
  }

  return { query, sort };
}

/**
 * POST /api/ai-advice
 * Body: same as /api/recommendations formData
 */
router.post("/", async (req, res) => {
  try {
    const formData = req.body;

    if (!formData) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // 1) Use your existing risk engine → consistent with UI & rec logic
    const riskResult = calculateRiskProfile(formData);
    const { riskProfile, allocation, meta } = riskResult;

    // 2) Pull a LIMITED, RISK-ALIGNED set of stocks from Mongo
    const { query, sort } = buildStockQueryForRisk(riskProfile);

    const stocks = await Stock.find(query)
      .sort(sort)
      .limit(12) // AI will choose 4–6 from these
      .lean();

    if (!stocks.length) {
      return res.status(500).json({
        error:
          "No stocks found in database for this risk profile. Please seed sample stocks first.",
      });
    }

    // 3) Compact stock context for AI
    const stockContext = stocks.map((s) => ({
      symbol: s.symbol,
      name: s.name,
      sector: s.sector,
      riskBucket: s.riskBucket,
      peRatio: s.peRatio,
      beta: s.beta,
      dividendYield: s.dividendYield,
      momentum: s.momentum,
      change1M: s.change1M,
    }));

    // 4) User / portfolio context
    const userContext = {
      riskProfile,
      allocation,
      age: meta?.factors?.age,
      income: meta?.factors?.income,
      investmentHorizon: meta?.factors?.investmentHorizon,
      emergencyFund: meta?.factors?.emergencyFund,
      behaviourOnDrawdown: meta?.factors?.marketDropResponse,
    };

    // 5) Call OpenAI with a strong, structured prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // adjust if you prefer a different model
      temperature: 0.35,      // slightly conservative, more consistent
      messages: [
        {
          role: "system",
          content:
            [
              - "You are a Tier-1 Equity Research Analyst trained in institutional-grade investment reporting. Your tone is structured, quantitative and authoritative — similar to Goldman Sachs, JP Morgan, BlackRock research notes. You do not predict or recommend trades. You evaluate quality, risk, momentum, and sector positioning like a real analyst. And you only operate inside the NSE/BSE stock exchange only — no assumptions outside it.",
              "Your tone is structured, concise and institutional – similar to Goldman Sachs, JP Morgan or BlackRock research.",
        "You DO NOT give personalised investment advice or trade instructions.",
        "You ONLY analyse the list of stocks provided and never mention or invent anything outside that universe.",
        "Focus on: portfolio role, risk/return trade-off, valuation (P/E), sector behaviour, and momentum (trend), described in professional research language.",
            ].join(" "),
        },
        {
          role: "user",
          content:
            [
              "User profile:",
              JSON.stringify(userContext, null, 2),
              "",
            //   "Internal sample universe of stocks (use ONLY these):",
            //   JSON.stringify(stockContext, null, 2),
              "",
              "Task:",
              "1. From the NSE and BSE, pick 7-8 stocks names that fit the user's risk profile and investment horizon.",
              "2. Write a concise research-style note (not markdown).",
              "",
              " 1. Portfolio context",
              "- Briefly restate the user's risk profile and the high-level allocation (stocks/bonds/gold/cash).",
              "- Mention what role equities are playing in this context (e.g., growth engine vs. stability).",
              "- Deliver a sharp overview of the investor’s risk posture, intended asset mix, and how equities behave as the portfolio engine. Use concise institutional tone.",
              "",
              " 2. Stock-by-stock commentary",
              "For each selected stock, use this sub-format:",
              "",
              " SYMBOL — Full Name",
              "- Role in portfolio: (e.g., core compounder, stabiliser, tactical growth, etc.)",
              "- Sector & profile: Briefly describe the sector and how it behaves in market cycles.",
              "- Valuation & quality: Refer to P/E and riskBucket where available. If data is missing, say so explicitly.",
              "- Momentum: Use the provided momentum label (bullish/bearish/neutral) and change1M to comment on recent trend, with a balanced view (no hype).",
              "- Key trade-off: One line on what the investor is accepting (e.g., higher volatility) in exchange for potential benefit.",
              "",
              "3. How this ties back to your profile",
              "- Deliver a fund-manager level reasoning why these stocks map to behavioural tolerance, time horizon, and growth vs volatility balance.",
              "",
              "4. Disclaimer",
              "- Final disclaimer must be strong and clear — never framed as advice. It must sound legally cautious.",
              "- Do NOT recommend that the user buy/sell anything.",
              "- Do NOT talk about specific price targets.",
              "- Do NOT mention stocks beyond the provided list.",
            ].join("\n"),
        },
      ],
    });

    const aiAdvice =
      completion.choices?.[0]?.message?.content?.trim() ||
      "AI was unable to generate an explanation. Please try again.";

    return res.json({
      riskProfile,
      allocation,
      aiAdvice,
    });
  } catch (err) {
    console.error("Error in /api/ai-advice:", err.message);
    res.status(500).json({ error: "AI advisor failed" });
  }
});

module.exports = router;

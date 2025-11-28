// src/routes/recommendRoutes.js
const express = require('express');
const { calculateRiskProfile } = require('../services/riskEngine');
const Stock = require('../models/Stock');

const router = express.Router();

// Helper: derive momentum label from change data
function computeMomentum(stock) {
  const c1M = stock.change1M;
  const c1W = stock.change1W;

  // Fallback: if no data, treat as neutral
  if (typeof c1M !== 'number' || typeof c1W !== 'number') {
    return 'neutral';
  }

  // Bullish: strong positive 1M trend, short-term non-negative
  if (c1M >= 8 && c1W >= 0) {
    return 'bullish';
  }

  // Bearish: strong negative 1M trend, short-term non-positive
  if (c1M <= -8 && c1W <= 0) {
    return 'bearish';
  }

  // Otherwise neutral
  return 'neutral';
}

/**
 * POST /api/recommendations
 */
router.post('/', async (req, res) => {
  try {
    const formData = req.body;

    if (!formData || !formData.riskTolerance || !formData.marketDropResponse) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // 1) risk profile
    const baseResult = calculateRiskProfile(formData);
    const { riskProfile } = baseResult;

    // 2) build query + explanation (same as before)
    const query = {};
    let sort = {};
    let limit = 6;
    let selectionExplanation = '';

    if (riskProfile === 'Conservative') {
      query.riskBucket = 'low';
      query.$and = [
        { $or: [{ beta: { $lte: 1.05 } }, { beta: { $exists: false } }] },
        { $or: [{ debtToEquity: { $lte: 1.0 } }, { debtToEquity: { $exists: false } }] },
      ];
      sort = { dividendYield: -1, peRatio: 1 };
      selectionExplanation =
        'These ideas are screened from the low-risk bucket, favouring businesses with relatively lower volatility, prudent leverage and a bias towards steady cash flows and dividends. The objective is to complement your capital-preservation oriented asset mix rather than maximise short-term upside.';
    } else if (riskProfile === 'Aggressive') {
      query.riskBucket = { $in: ['medium', 'high'] };
      sort = { profitMargin: -1, peRatio: 1 };
      selectionExplanation =
        'These ideas are drawn from medium-to-high risk names with above-average profitability and earnings power, accepting higher price volatility in exchange for long-term growth potential. The bias is towards compounders where upside participation matters more than short-term drawdowns.';
    } else {
      query.riskBucket = { $in: ['low', 'medium'] };
      sort = { peRatio: 1 };
      selectionExplanation =
        'The shortlist combines relatively stable and moderately aggressive names, aiming for a balance between downside protection and upside participation. Screening emphasises reasonable valuation and quality so that the equity sleeve stays aligned with a balanced risk profile.';
    }

    // 3) Fetch from Mongo
    const rawStocks = await Stock.find(query).sort(sort).limit(limit).lean();

    // 4) Attach dynamic momentum
    const recommendedStocks = rawStocks.map((s) => ({
      ...s,
      momentum: computeMomentum(s), // override / set from changes
    }));

    // 5) Return full object
    return res.json({
      ...baseResult,
      selectionExplanation,
      recommendedStocks,
    });
  } catch (err) {
    console.error('Error in /api/recommendations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

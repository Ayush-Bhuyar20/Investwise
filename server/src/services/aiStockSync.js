// src/services/aiStockSync.js
const Stock = require("../models/Stock");
const { fetchQuoteForSymbol } = require("./yahooClient");

/**
 * Map AI {symbol, exchange} to Yahoo symbol the API understands:
 *  RELIANCE + NSE -> RELIANCE.NS
 *  TCS + BSE      -> TCS.BO
 */
function toYahooSymbol(symbol, exchange) {
  if (!symbol || !exchange) return null;
  const base = symbol.trim().toUpperCase();
  if (exchange === "NSE") return `${base}.NS`;
  if (exchange === "BSE") return `${base}.BO`;
  return base;
}

/**
 * Derive a rough momentum tag from daily % move + 52W change
 */
function deriveMomentum(change1D, change52W) {
  if (typeof change1D !== "number" && typeof change52W !== "number") {
    return "neutral";
  }

  // Simple heuristic: strong up daily or strong up 52W -> bullish
  if (
    (typeof change1D === "number" && change1D >= 2) ||
    (typeof change52W === "number" && change52W >= 15)
  ) {
    return "bullish";
  }

  // Strong down daily or weak 52W -> bearish
  if (
    (typeof change1D === "number" && change1D <= -2) ||
    (typeof change52W === "number" && change52W <= -15)
  ) {
    return "bearish";
  }

  return "neutral";
}

/**
 * Given AI-picked stocks, ensure they exist in DB
 * with fresh price and basic momentum derived from get-options.
 *
 * aiStocks: [{ symbol, exchange, name, roughRiskBucket, role, rationale }]
 */
async function syncAIStocks(aiStocks) {
  const enriched = [];

  for (const s of aiStocks) {
    const yahooSymbol = toYahooSymbol(s.symbol, s.exchange);

    if (!yahooSymbol) continue;

    let quote;
    try {
      quote = await fetchQuoteForSymbol(yahooSymbol);
    } catch (err) {
      console.error(
        `Failed to fetch quote for ${s.symbol} (${yahooSymbol}):`,
        err.message
      );
      continue;
    }

    const momentum = deriveMomentum(
      quote.change1D,
      quote.change52W
    );

    const update = {
      symbol: s.symbol.toUpperCase(),
      name: s.name,
      exchange: s.exchange,
      riskBucket: s.roughRiskBucket,
      currentPrice: quote.currentPrice,
      // We'll map these fields into your schema:
      change1D: quote.change1D,
      change1W: null, // not available from this endpoint
      change1M: quote.change52W, // NOTE: this is actually 52W change; you can rename later
      momentum,
      peRatio: quote.forwardPE ?? null,
      priceToBook: quote.priceToBook ?? null,
      marketCap: quote.marketCap ?? null,
      // You can add more fundamental fields as you explore the API
    };

    const saved = await Stock.findOneAndUpdate(
      { symbol: update.symbol },
      { $set: update },
      { upsert: true, new: true }
    );

    enriched.push({
      ...saved.toObject(),
      aiRole: s.role,
      aiRationale: s.rationale,
    });
  }

  return enriched;
}

module.exports = {
  syncAIStocks,
};

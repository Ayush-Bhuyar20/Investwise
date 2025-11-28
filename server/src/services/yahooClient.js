// src/services/yahooClient.js
const axios = require("axios");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "yahoo-finance-real-time1.p.rapidapi.com";

if (!RAPIDAPI_KEY) {
  console.warn("⚠️ RAPIDAPI_KEY not set in .env");
}
if (!RAPIDAPI_HOST) {
  console.warn("⚠️ RAPIDAPI_HOST not set in .env");
}

const yahooApi = axios.create({
  baseURL: "https://yahoo-finance-real-time1.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
  },
});

/**
 * Fetch quote-style data via get-options endpoint.
 * We only care about the `quote` object: price, daily % move, some valuation.
 *
 * @param {string} symbol - e.g. "RELIANCE.NS", "TCS.NS"
 */
async function fetchQuoteForSymbol(symbol) {
  const res = await yahooApi.get("/stock/get-options", {
    params: {
      symbol,
      lang: "en-US",
      region: "IN", // you can tweak this if needed
    },
  });

  const quote =
    res.data?.optionChain?.result?.[0]?.quote || null;

  if (!quote) {
    throw new Error("No quote field in get-options response");
  }

  // Map to the shape we want
  return {
    symbol: quote.symbol, // e.g. "RELIANCE.NS"
    currentPrice: quote.regularMarketPrice ?? null,
    change1D: quote.regularMarketChangePercent ?? null, // %
    // We'll treat 52W change as a rough proxy for longer-term momentum
    change52W: quote.fiftyTwoWeekChangePercent ?? null, // %
    forwardPE: quote.forwardPE ?? null,
    priceToBook: quote.priceToBook ?? null,
    marketCap: quote.marketCap ?? null,
    // You can extend this as needed when you see full response
  };
}

module.exports = {
  fetchQuoteForSymbol,
};

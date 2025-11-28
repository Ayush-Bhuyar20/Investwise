// src/services/marketData.js
const Stock = require('../models/Stock');
const { fetchHistory1Month } = require('./yahooClient');

// Compute 1D / 1W / 1M % changes from price candles
function computeChangesFromSeries(series) {
  if (!series || series.length < 2) return {};

  const n = series.length;
  const last = series[n - 1].close;
  const d1   = series[n - 2]?.close ?? last;
  const d5   = series[n - 6]?.close ?? series[0].close;
  const d22  = series[n - 23]?.close ?? series[0].close;

  const pct = (now, prev) =>
    prev && prev !== 0 ? ((now - prev) / prev) * 100 : 0;

  return {
    currentPrice: last,
    change1D: pct(last, d1),
    change1W: pct(last, d5),
    change1M: pct(last, d22),
  };
}

// Update single stock
async function updateStockMomentum(symbol) {
  try {
    const series = await fetchHistory1Month(symbol);
    const update = computeChangesFromSeries(series);

    await Stock.updateOne({ symbol }, { $set: { ...update, lastUpdated: new Date() } });

    console.log(`🔄 Updated ${symbol}: ${update.change1M?.toFixed(2)}% (1M)`);
  } catch (err) {
    console.error(`❌ Momentum update failed for ${symbol}`, err.message);
  }
}

// Update all stocks
async function updateAllStocksMomentum() {
  const stocks = await Stock.find({}, { symbol: 1 }).lean();
  console.log(`📈 Updating momentum for ${stocks.length} stocks`);

  for (const s of stocks) {
    await updateStockMomentum(s.symbol); // sequential avoid rate limits
  }

  console.log("🟢 All stocks updated with momentum signals");
}

module.exports = { updateStockMomentum, updateAllStocksMomentum };

// src/services/marketDataHelpers.js

function computeChangesFromSeries(series) {
  if (!series || series.length < 2) {
    return {
      currentPrice: null,
      change1D: null,
      change1W: null,
      change1M: null,
    };
  }

  const n = series.length;
  const last = series[n - 1].close;
  const prev1 = series[n - 2]?.close ?? last;
  const prev5 = series[n - 6]?.close ?? series[0].close;
  const prev22 = series[n - 23]?.close ?? series[0].close;

  const pct = (now, prev) =>
    prev && prev !== 0 ? ((now - prev) / prev) * 100 : 0;

  return {
    currentPrice: last,
    change1D: pct(last, prev1),
    change1W: pct(last, prev5),
    change1M: pct(last, prev22),
  };
}

module.exports = { computeChangesFromSeries };

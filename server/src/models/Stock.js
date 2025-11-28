// src/models/Stock.js
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    exchange: { type: String, default: "NSE" },
    sector: { type: String }, // ✅ already here

    currentPrice: { type: Number },
    peRatio: { type: Number }, // ✅ for P/E
    beta: { type: Number },
    dividendYield: { type: Number },
    debtToEquity: { type: Number },
    profitMargin: { type: Number },
    freeCashFlow: { type: Number },

    riskBucket: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    // ✅ Simple return-based fields for momentum
    change1D: { type: Number }, // in %, e.g. 1.5 means +1.5%
    change1W: { type: Number },
    change1M: { type: Number },

    // Keep momentum field if you want, but it won’t be used anymore
    momentum: {
      type: String,
      enum: ["bullish", "bearish", "neutral"],
      default: "neutral",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;

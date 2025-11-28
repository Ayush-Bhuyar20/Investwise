// src/seed/seedSampleStocks.js
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Stock = require("../models/Stock");

dotenv.config();

async function seed() {
  await connectDB();

  const sampleStocks = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      sector: "Energy",
      currentPrice: 2915.5,
      peRatio: 25.3,
      beta: 1.1,
      dividendYield: 0.32,
      debtToEquity: 0.6,
      profitMargin: 8.5,
      freeCashFlow: 50000,
      riskBucket: "medium",
      change1D: 0.8,
      change1W: 2.4,
      change1M: 9.5, // strong positive → Bullish
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services Ltd",
      sector: "IT",
      currentPrice: 3845.1,
      peRatio: 30.2,
      beta: 0.9,
      dividendYield: 1.5,
      debtToEquity: 0.1,
      profitMargin: 22,
      freeCashFlow: 45000,
      riskBucket: "low",
      change1D: -0.3,
      change1W: 0.2,
      change1M: 4.0, // mild, mixed → Neutral
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      sector: "Banking",
      currentPrice: 1520.75,
      peRatio: 20.1,
      beta: 1.0,
      dividendYield: 1.2,
      debtToEquity: 0.5,
      profitMargin: 18,
      freeCashFlow: 30000,
      riskBucket: "low",
      change1D: -1.2,
      change1W: -3.5,
      change1M: -10.2, // strong negative → Bearish
    },
    {
      symbol: "ADANIPORTS",
      name: "Adani Ports and Special Economic Zone Ltd",
      sector: "Infrastructure",
      currentPrice: 1350.0,
      peRatio: 28.7,
      beta: 1.3,
      dividendYield: 0.6,
      debtToEquity: 1.0,
      profitMargin: 14,
      freeCashFlow: 15000,
      riskBucket: "high",
      change1D: 1.1,
      change1W: 4.2,
      change1M: 12.3, // strong positive → Bullish
    },
  ];

  try {
    await Stock.deleteMany({});
    console.log("🧹 Cleared existing stocks");

    await Stock.insertMany(sampleStocks);
    console.log("✅ Inserted sample stocks");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding stocks:", err);
    process.exit(1);
  }
}

seed();

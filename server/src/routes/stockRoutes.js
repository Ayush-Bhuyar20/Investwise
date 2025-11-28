// src/routes/stockRoutes.js
const express = require('express');
const Stock = require('../models/Stock');

const router = express.Router();

// GET /api/stocks
// Return all stocks (limited to 100 for safety)
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find().limit(100).lean();
    res.json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// (Optional) GET /api/stocks/:symbol
router.get('/:symbol', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() }).lean();
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (err) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

module.exports = router;

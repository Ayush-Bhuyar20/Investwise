// src/index.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const connectDB = require('./config/db');
const recommendRoutes = require('./routes/recommendRoutes');
const stockRoutes = require('./routes/stockRoutes');
const aiAdviceRoutes = require('./routes/aiAdviceRoutes');
const { updateAllStocksMomentum } = require('./services/marketData');
const aiStockPicksRoutes = require('./routes/aiStockPicksRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Read allowed frontend origin from env (for deployment)
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Simple root + health routes
app.get('/', (req, res) => {
  res.send('InvestWise backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvestWise backend is running' });
});

// API routes
app.use('/api/recommendations', recommendRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/ai-advice', aiAdviceRoutes);
app.use('/api/ai-stock-picks', aiStockPicksRoutes);

// Cron for momentum (every 6 hours)
cron.schedule('0 */6 * * *', async () => {
  console.log('⏱ Cron: starting scheduled momentum update...');
  try {
    await updateAllStocksMomentum();
    console.log('⏱ Cron: momentum update finished');
  } catch (err) {
    console.error('⏱ Cron: momentum update failed:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server listening on port ${PORT}`);
});

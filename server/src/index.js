// src/index.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const connectDB = require('./config/db');
const recommendRoutes = require('./routes/recommendRoutes');
const stockRoutes = require('./routes/stockRoutes'); // ⬅️ we will create this next
const aiAdviceRoutes = require('./routes/aiAdviceRoutes');
const { updateAllStocksMomentum } = require('./services/marketData');



const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvestWise backend is running' });
});

// API routes
app.use('/api/recommendations', recommendRoutes);
app.use('/api/stocks', stockRoutes); // ⬅️ new
app.use('/api/ai-advice', aiAdviceRoutes);
// Cron for momentum
cron.schedule('0 */6 * * *', async () => {
  console.log('⏱ Cron: starting scheduled momentum update...');
  try {
    await updateAllStocksMomentum();
    console.log('⏱ Cron: momentum update finished');
  } catch (err) {
    console.error('⏱ Cron: momentum update failed:', err.message);
  }
});
const aiStockPicksRoutes = require("./routes/aiStockPicksRoutes");
app.use("/api/ai-stock-picks", aiStockPicksRoutes);



app.listen(PORT, () => {
  console.log(`✅ Backend server listening on port ${PORT}`);
});

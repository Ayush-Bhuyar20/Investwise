// src/components/MarketMovers/MarketMovers.jsx
import './MarketMovers.css';

// Sample data - later, this will come from your backend API
const marketData = {
  topGainers: [
    { symbol: 'TATASTEEL', price: 178.20, change: '+5.60%' },
    { symbol: 'ADANIPORTS', price: 1350.00, change: '+4.20%' },
    { symbol: 'COALINDIA', price: 460.15, change: '+3.85%' },
    { symbol: 'JSWSTEEL', price: 912.50, change: '+3.10%' },
  ],
  topLosers: [
    { symbol: 'HCLTECH', price: 1440.80, change: '-3.15%' },
    { symbol: 'INFY', price: 1610.25, change: '-2.80%' },
    { symbol: 'ASIANPAINT', price: 2885.50, change: '-2.50%' },
    { symbol: 'TCS', price: 3845.10, change: '-2.10%' },
  ],
  topByVolume: [
    { symbol: 'YESBANK', price: 23.50, volume: '25.5 Cr' },
    { symbol: 'RELIANCE', price: 2915.50, volume: '10.2 Cr' },
    { symbol: 'TATAMOTORS', price: 975.00, volume: '8.8 Cr' },
    { symbol: 'HDFCBANK', price: 1520.75, volume: '7.5 Cr' },
  ],
};

function MarketMovers() {
  return (
    <section className="market-movers-section">
      <div className="section-header">
        <h2>Today's Market Movers</h2>
        <p>Stay updated with the latest market trends.</p>
      </div>
      <div className="movers-grid">
        {/* Top Gainers Card */}
        <div className="mover-card">
          <h3 className="card-title gainers">📈 Top Gainers</h3>
          <ul className="mover-list">
            {marketData.topGainers.map(stock => (
              <li className="mover-item" key={stock.symbol}>
                <span className="symbol">{stock.symbol}</span>
                <span className="price">₹{stock.price.toFixed(2)}</span>
                <span className="change positive">{stock.change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Losers Card */}
        <div className="mover-card">
          <h3 className="card-title losers">📉 Top Losers</h3>
          <ul className="mover-list">
            {marketData.topLosers.map(stock => (
              <li className="mover-item" key={stock.symbol}>
                <span className="symbol">{stock.symbol}</span>
                <span className="price">₹{stock.price.toFixed(2)}</span>
                <span className="change negative">{stock.change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top by Volume Card */}
        <div className="mover-card">
          <h3 className="card-title volume">📊 Top by Volume</h3>
          <ul className="mover-list">
            {marketData.topByVolume.map(stock => (
              <li className="mover-item" key={stock.symbol}>
                <span className="symbol">{stock.symbol}</span>
                <span className="price">₹{stock.price.toFixed(2)}</span>
                <span className="volume-value">{stock.volume}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default MarketMovers;
// src/components/Hero/Hero.jsx
import './Hero.css';

function Hero() {
  return (
    // The id="hero" attribute is now added here
    <section id="hero" className="hero-section">
      <div className="hero-grid">
        {/* Left Column: Text Content */}
        <div className="hero-text-content">
          <h1>Smart Investment Decisions Start Here</h1>
          <p>Discover your risk profile and get personalized investment recommendations powered by AI.</p>
          {/* This link also needs to be a ScrollLink to work properly */}
          <a href="#assessment" className="cta-button">
            Start Risk Assessment
          </a>
        </div>
        
        {/* Right Column: Live Ticker Graphic */}
        <div className="hero-graphic-content">
          <div className="market-ticker-card">
            <div className="ticker-header">
              <h3>Live Market</h3>
            </div>
            <div className="ticker-wrap">
              <div className="ticker-move">
                <div className="ticker-item"><span className="symbol">RELIANCE</span> <span className="price">₹2,915.50</span> <span className="change positive">+1.25%</span></div>
                <div className="ticker-item"><span className="symbol">TCS</span> <span className="price">₹3,845.10</span> <span className="change negative">-0.80%</span></div>
                <div className="ticker-item"><span className="symbol">HDFCBANK</span> <span className="price">₹1,520.75</span> <span className="change positive">+0.55%</span></div>
                <div className="ticker-item"><span className="symbol">INFY</span> <span className="price">₹1,630.00</span> <span className="change negative">-1.10%</span></div>
                <div className="ticker-item"><span className="symbol">NIFTY 50</span> <span className="price">22,504.45</span> <span className="change positive">+0.22%</span></div>
                {/* Duplicate the items for a seamless scrolling loop */}
                <div className="ticker-item"><span className="symbol">RELIANCE</span> <span className="price">₹2,915.50</span> <span className="change positive">+1.25%</span></div>
                <div className="ticker-item"><span className="symbol">TCS</span> <span className="price">₹3,845.10</span> <span className="change negative">-0.80%</span></div>
                <div className="ticker-item"><span className="symbol">HDFCBANK</span> <span className="price">₹1,520.75</span> <span className="change positive">+0.55%</span></div>
                <div className="ticker-item"><span className="symbol">INFY</span> <span className="price">₹1,630.00</span> <span className="change negative">-1.10%</span></div>
                <div className="ticker-item"><span className="symbol">NIFTY 50</span> <span className="price">22,504.45</span> <span className="change positive">+0.22%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
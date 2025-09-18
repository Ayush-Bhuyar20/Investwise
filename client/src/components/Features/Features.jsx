// src/components/Features/Features.jsx
import './Features.css';

function Features() {
  return (
    
    <section id="features" className="features-section">
      <div className="features-intro">
        <h2>Why InvestWise?</h2>
        <p>We combine cutting-edge AI with expert financial strategies to give you an unparalleled investment experience.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered Analysis</h3>
          <p>Get personalized portfolio recommendations based on a deep understanding of your risk profile.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Real-Time Market Data</h3>
          <p>Stay ahead of the curve with up-to-the-minute market movers, news, and insights.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure & Trustworthy</h3>
          <p>Your data is your own. We use industry-standard security to protect your information.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
// src/components/MarketNews/MarketNews.jsx
import './MarketNews.css';

// Sample data - later, this will come from your backend API
const mockNewsData = [
  {
    id: 1,
    category: 'Economy',
    title: 'RBI holds key interest rates steady amid inflation concerns.',
    summary: 'The Reserve Bank of India decided to keep the repo rate unchanged at 6.5% for the eighth consecutive time...',
    source: 'Reuters',
    timeAgo: '2h ago',
  },
  {
    id: 2,
    category: 'Stocks',
    title: 'Tech stocks surge as global chip demand shows signs of recovery.',
    summary: 'Leading IT and semiconductor stocks saw a significant rally today, boosting the overall market sentiment.',
    source: 'Bloomberg',
    timeAgo: '4h ago',
  },
  {
    id: 3,
    category: 'Corporate',
    title: 'Reliance Industries announces major investment in green energy.',
    summary: 'The conglomerate plans to invest over $10 billion in building a fully integrated green energy ecosystem.',
    source: 'Livemint',
    timeAgo: '1d ago',
  },
];


function MarketNews() {
  return (
    <section className="market-news-section">
      <div className="section-header">
        <h2>Market News</h2>
        <p>Get the top market news by AI filtration to your feeds.</p>
      </div>
      <div className="news-grid">
        {mockNewsData.map(article => (
          <a href="#" className="news-card" key={article.id}>
            <div className="news-card-image-placeholder"></div>
            <div className="news-card-content">
              <span className="news-category">{article.category}</span>
              <h3 className="news-title">{article.title}</h3>
              <p className="news-summary">{article.summary}</p>
              <div className="news-meta">
                <span className="news-source">{article.source}</span>
                <span className="news-time">{article.timeAgo}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default MarketNews;
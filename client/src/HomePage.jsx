// src/HomePage.jsx
import Hero from './components/Hero/Hero.jsx';
import Features from './components/Features/Features.jsx';
import AssessmentForm from './components/AssessmentForm/AssessmentForm.jsx';
import MarketMovers from './components/MarketMovers/MarketMovers.jsx';
import MarketNews from './components/MarketNews/MarketNews.jsx';

// This component just holds all our main page sections
function HomePage({ currentUser }) {
  return (
    <main>
      <Hero />
      <Features />
      <AssessmentForm user={currentUser} /> {/* Pass user down */}
      <MarketMovers />
      <MarketNews />
    </main>
  );
}

export default HomePage;
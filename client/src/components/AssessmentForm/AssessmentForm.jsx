// src/components/AssessmentForm/AssessmentForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link for navigation
import './AssessmentForm.css';
import ResultsCard from '../ResultsCard/ResultsCard.jsx';

// This is the new component that will be shown to logged-out users
const LoginPrompt = () => {
  return (
    <div className="login-prompt">
      <div className="form-header">
        <h2>Discover Your Investor Profile</h2>
        <p>Sign in to take our comprehensive assessment and receive your personalized investment strategy.</p>
      </div>
      <Link to="/login" className="prompt-button">
        Sign In to Get Started
      </Link>
    </div>
  );
};


// The main component now accepts a 'user' prop
function AssessmentForm({ user }) {
  // All your existing form logic (state, handlers) remains the same
  const [formData, setFormData] = useState({
    age: '', income: '', emergencyFund: '', investmentHorizon: '', marketDropResponse: '', riskTolerance: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // In the future, this will be a real API call
    setTimeout(() => {
      // This fake logic will be replaced by our backend
      let profile = 'Moderate';
      if (formData.riskTolerance === 'Conservative' || formData.marketDropResponse === 'sell-all') profile = 'Conservative';
      if (formData.riskTolerance === 'Aggressive' || formData.marketDropResponse === 'buy-more') profile = 'Aggressive';
      
      const resultsData = {
        Conservative: { riskProfile: 'Conservative', description: 'Your profile suggests a focus on capital preservation...', allocation: { stocks: 20, bonds: 60, gold: 15, cash: 5 } },
        Moderate: { riskProfile: 'Moderate', description: 'Your profile suggests a balanced approach...', allocation: { stocks: 60, bonds: 30, gold: 5, cash: 5 } },
        Aggressive: { riskProfile: 'Aggressive', description: 'Your profile indicates a strong appetite for growth...', allocation: { stocks: 85, bonds: 10, gold: 2.5, cash: 2.5 } },
      };
      setResults(resultsData[profile]);
      setIsLoading(false);
    }, 2000);
  };

  const handleRetake = () => {
    setResults(null);
    setFormData({ age: '', income: '', emergencyFund: '', investmentHorizon: '', marketDropResponse: '', riskTolerance: '' });
  };

  return (
    <section id="assessment" className="assessment-section">
      <div className="form-container">
        {/* --- This is the new conditional logic --- */}
        {results ? (
          // 1. If there are results, show the results card
          <ResultsCard data={results} onRetake={handleRetake} />
        ) : user ? (
          // 2. If no results BUT the user is logged in, show the form
          <>
            <div className="form-header">
              <h2>Discover Your Investor Profile</h2>
              <p>This short assessment will help us understand your risk tolerance and financial goals to provide personalized recommendations.</p>
            </div>
            <form className="assessment-form" onSubmit={handleSubmit}>
              {/* The form with all its questions goes here, unchanged */}
              <div className="form-group">
                <label htmlFor="age">What is your age?</label>
                <select id="age" name="age" value={formData.age} onChange={handleChange} required>
                  <option value="">Select your age range</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="55+">55+</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="income">What is your approximate annual income?</label>
                <select id="income" name="income" value={formData.income} onChange={handleChange} required>
                  <option value="">Select your income bracket</option>
                  <option value="<5L">Less than ₹5 Lakh</option>
                  <option value="5L-10L">₹5 Lakh - ₹10 Lakh</option>
                  <option value="10L-20L">₹10 Lakh - ₹20 Lakh</option>
                  <option value="20L-50L">₹20 Lakh - ₹50 Lakh</option>
                  <option value=">50L">More than ₹50 Lakh</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="emergencyFund">Do you have an emergency fund for 3-6 months of expenses?</label>
                <select id="emergencyFund" name="emergencyFund" value={formData.emergencyFund} onChange={handleChange} required>
                  <option value="">Select an answer</option>
                  <option value="yes">Yes, I am covered.</option>
                  <option value="no">No, I am still building it.</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="investmentHorizon">What is your investment horizon?</label>
                <select id="investmentHorizon" name="investmentHorizon" value={formData.investmentHorizon} onChange={handleChange} required>
                  <option value="">How long do you plan to invest?</option>
                  <option value="1-3 years">Short-term (1-3 years)</option>
                  <option value="3-5 years">Mid-term (3-5 years)</option>
                  <option value="5-10 years">Long-term (5-10 years)</option>
                  <option value="10+ years">Very Long-term (10+ years)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="marketDropResponse">If your portfolio lost 20% in a month, what would you do?</label>
                <select id="marketDropResponse" name="marketDropResponse" value={formData.marketDropResponse} onChange={handleChange} required>
                  <option value="">Select your likely reaction</option>
                  <option value="sell-all">Sell all of it</option>
                  <option value="sell-some">Sell some of it</option>
                  <option value="do-nothing">Hold and do nothing</option>
                  <option value="buy-more">See it as a buying opportunity and invest more</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="riskTolerance">Which best describes your investment goal?</label>
                <select id="riskTolerance" name="riskTolerance" value={formData.riskTolerance} onChange={handleChange} required>
                  <option value="">Select your primary goal</option>
                  <option value="Conservative">Preservation: I want to protect my capital with minimal risk.</option>
                  <option value="Moderate">Balance: I'm willing to take balanced risks for balanced returns.</option>
                  <option value="Aggressive">Growth: I'm willing to take high risks for high potential returns.</option>
                </select>
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Get My Assessment'}
              </button>
            </form>
          </>
        ) : (
          // 3. If no results AND no user, show the login prompt
          <LoginPrompt />
        )}
      </div>
    </section>
  );
}

export default AssessmentForm;
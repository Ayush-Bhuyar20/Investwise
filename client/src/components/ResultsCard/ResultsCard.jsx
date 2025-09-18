// src/components/ResultsCard/ResultsCard.jsx
import './ResultsCard.css';
// 1. Import the Pie chart components
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// 2. Register the components we need for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function ResultsCard({ data, onRetake }) {
  // 3. Prepare the data and options for the chart
  const chartData = {
    labels: Object.keys(data.allocation),
    datasets: [
      {
        label: '% Allocation',
        data: Object.values(data.allocation),
        backgroundColor: [
          'hsl(221, 83%, 53%)', // Blue for Stocks
          'hsl(215, 5.1%, 53.1%)', // Gray for Bonds
          'hsl(48, 95%, 61%)',  // Yellow for Gold
          'hsl(210, 40%, 96.1%)', // Light Gray for Cash
        ],
        borderColor: 'hsl(0, 0%, 100%)', // White border
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
        },
      },
    },
  };

  return (
    // 4. New two-column grid structure
    <div className="results-grid">
      {/* --- Left Column --- */}
      <div className="results-text-content">
        <div className="results-header">
          <span className="profile-tag">{data.riskProfile}</span>
          <h1>The <span className="highlight-profile">{data.riskProfile}</span> Investor</h1>
        </div>
        <div className="results-body">
          <p className="results-description">{data.description}</p>
        </div>
        <div className="results-footer">
          <button className="retake-button" onClick={onRetake}>Retake Assessment</button>
          <button className="view-portfolio-button">View Full Portfolio</button>
        </div>
      </div>

      {/* --- Right Column --- */}
      <div className="results-chart-content">
        <h4>Suggested Allocation</h4>
        {/* 5. Place the <Pie /> component here */}
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default ResultsCard;
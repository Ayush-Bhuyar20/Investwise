// src/components/ResultsCard/ResultsCard.jsx
import "./ResultsCard.css";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function ResultsCard({ data, onRetake, onViewAIAdvice }) {
  // 🔥 Now using AI-driven stocks from /api/ai-stock-picks
  const aiStocks = data?.aiStocks || [];

  // Allocation pie
  const chartData = {
    labels: Object.keys(data.allocation || {}),
    datasets: [
      {
        label: "% Allocation",
        data: Object.values(data.allocation || {}),
        backgroundColor: [
          "hsl(221, 83%, 53%)",
          "hsl(215, 5.1%, 53.1%)",
          "hsl(48, 95%, 61%)",
          "hsl(210, 40%, 96.1%)",
        ],
        borderColor: "hsl(0, 0%, 100%)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
        },
      },
    },
  };

  // Momentum bar chart (1M change across AI picks)
  const barLabels = aiStocks.map((s) => s.symbol);
  const barDataValues = aiStocks.map((s) =>
    typeof s.change1M === "number" ? s.change1M : 0
  );

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "1M Price Change (%)",
        data: barDataValues,
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="results-grid">
      {/* --- Left Column: Profile + CTA --- */}
      <div className="results-text-content">
        <div className="results-header">
          <span className="profile-tag">{data.riskProfile}</span>
          <h1>
            The <span className="highlight-profile">{data.riskProfile}</span>{" "}
            Investor
          </h1>
        </div>
        <div className="results-body">
          <p className="results-description">
            {/* You can swap this to use a backend description later */}
            This portfolio view reflects how an AI research engine would
            position a basket of Indian equities for your current risk profile
            and time horizon.
          </p>
        </div>
        <div className="results-footer">
          <button className="retake-button" onClick={onRetake}>
            Retake Assessment
          </button>
          <button
            className="view-portfolio-button"
            onClick={() => onViewAIAdvice && onViewAIAdvice()}
          >
            View AI Research Summary
          </button>
        </div>
      </div>

      {/* --- Right Column: Charts + AI Stock Insights --- */}
      <div className="results-chart-content">
        <h4>Suggested Allocation</h4>
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>

        {aiStocks.length >= 2 && (
          <div className="results-comparison">
            <h4>Momentum Snapshot (1M)</h4>
            <div className="chart-container bar-chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        )}

        {aiStocks.length > 0 && (
          <div className="recommended-stocks">
            <h4>AI-Selected Stock Insights</h4>
            <div className="stock-grid">
              {aiStocks.map((stock) => {
                const shortRationale = stock.aiRationale
                  ? stock.aiRationale.split(".").slice(0, 2).join(". ").trim() +
                    "."
                  : null;

                return (
                  <div key={stock.symbol} className="stock-card">
                    <div className="stock-card-header">
                      <div>
                        <div className="stock-symbol-line">
                          <span className="stock-symbol">{stock.symbol}</span>
                          {stock.riskBucket && (
                            <span
                              className={`stock-risk-pill ${stock.riskBucket}`}
                            >
                              {stock.riskBucket.charAt(0).toUpperCase() +
                                stock.riskBucket.slice(1)}{" "}
                              risk
                            </span>
                          )}
                        </div>
                        {stock.name && (
                          <div className="stock-name">{stock.name}</div>
                        )}
                        {stock.sector && (
                          <div className="stock-sector">{stock.sector}</div>
                        )}
                      </div>

                      {stock.aiRole && (
                        <span className="stock-role-chip">{stock.aiRole}</span>
                      )}
                    </div>

                    <div className="stock-card-body">
                      <div className="stock-price-row">
                        {typeof stock.currentPrice === "number" && (
                          <span className="stock-price">
                            ₹{stock.currentPrice.toFixed(2)}
                          </span>
                        )}
                        {typeof stock.peRatio === "number" && (
                          <span className="stock-pe">
                            P/E {stock.peRatio.toFixed(1)}x
                          </span>
                        )}
                      </div>

                      {shortRationale && (
                        <p className="stock-rationale-snippet">
                          {shortRationale}
                        </p>
                      )}
                    </div>

                    <div className="stock-card-footer">
                      <div className="stock-momentum-strip">
                        {stock.momentum && (
                          <span className={`stock-momentum ${stock.momentum}`}>
                            {stock.momentum.charAt(0).toUpperCase() +
                              stock.momentum.slice(1)}
                          </span>
                        )}
                        {typeof stock.change1M === "number" && (
                          <span
                            className={`stock-change1m ${
                              stock.change1M >= 0 ? "pos" : "neg"
                            }`}
                          >
                            {stock.change1M >= 0 ? "+" : ""}
                            {stock.change1M.toFixed(1)}% 1M
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsCard;

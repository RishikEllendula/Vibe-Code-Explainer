import React, { useState, useEffect } from 'react';
import './ExplanationCard.css';

interface ExplanationCardProps {
  summary: string;
  details: string;
  keyChanges?: string[];
  recommendations?: string[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  summary,
  details,
  keyChanges = [],
  recommendations = []
}) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  return (
    <div className={`explanation-card ${animateIn ? 'animate-in' : ''}`}>
      <div className="card-header">
        <div className="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>AI Explanation</h2>
      </div>

      <div className="card-section summary-section">
        <h3>📝 Summary</h3>
        <p className="summary-text">{summary}</p>
      </div>

      <div className="card-section details-section">
        <h3>🔍 Detailed Explanation</h3>
        <p className="details-text">{details}</p>
      </div>

      {keyChanges.length > 0 && (
        <div className="card-section changes-section">
          <h3>✨ Key Changes</h3>
          <ul className="changes-list">
            {keyChanges.map((change, idx) => (
              <li key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="change-bullet">→</span>
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="card-section recommendations-section">
          <h3>💡 Recommendations</h3>
          <ul className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <li key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="rec-bullet">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

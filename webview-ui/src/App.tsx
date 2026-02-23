import React, { useState } from 'react';
import { DiffViewer } from './components/DiffViewer';
import { ExplanationCard } from './components/ExplanationCard';
import './App.css';

function App() {
  // Example data - this will come from the extension in real usage
  const [showDemo] = useState(true);

  const exampleOldCode = `function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}`;

  const exampleNewCode = `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;

  const exampleSummary = "Refactored the calculateTotal function to use Array.reduce() method instead of a for loop, making the code more concise and functional.";

  const exampleDetails = "The original implementation used an imperative for loop to iterate through items and accumulate the total. The new version uses the reduce() method, which is a more declarative and functional approach. This reduces the code from 6 lines to a single return statement while maintaining the same functionality.";

  const exampleKeyChanges = [
    "Replaced manual for loop with Array.reduce() method",
    "Eliminated the need for a mutable total variable",
    "Reduced function body to a single expression",
    "Made the code more declarative and easier to understand"
  ];

  const exampleRecommendations = [
    "Consider adding TypeScript types for better type safety",
    "Add null/undefined checks for items parameter",
    "Consider using optional chaining for safer property access",
    "Add JSDoc comments to document the function's purpose"
  ];

  return (
    <div className="app">
      <div className="app-header">
        <h1>🎨 Vibe Code Explainer</h1>
        <p className="subtitle">Understand your code changes with AI-powered explanations</p>
      </div>

      {showDemo && (
        <div className="content-wrapper">
          <DiffViewer
            oldCode={exampleOldCode}
            newCode={exampleNewCode}
            language="javascript"
            fileName="utils.js"
          />

          <ExplanationCard
            summary={exampleSummary}
            details={exampleDetails}
            keyChanges={exampleKeyChanges}
            recommendations={exampleRecommendations}
          />

          <div className="demo-notice">
            <p>👆 This is a demo view. When you make code changes, they will appear here automatically!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

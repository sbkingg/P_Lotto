// 📁 frontend/src/App.js
import React from 'react';
import StrategyHub from './components/StrategyHub';

import FilterSuggestion from "./components/FilterSuggestion";
import StrategySimulator from "./components/StrategySimulator";
import ChartView from "./components/ChartView";
import DownloadLogs from "./components/DownloadLogs";
import BestStrategy from "./components/BestStrategy";

function App() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-800">🎯 로또 전략 통합 허브</h1>
      <StrategyHub />
    </div>
  );
}

export default App;

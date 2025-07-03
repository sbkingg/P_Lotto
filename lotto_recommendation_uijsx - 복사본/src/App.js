// src/App.js
import React, { useState } from "react";
import FilterSuggestion from "./components/FilterSuggestion";
import StrategySimulator from "./components/StrategySimulator";
import ChartView from "./components/ChartView";
import DownloadLogs from "./components/DownloadLogs";

function App() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [history, setHistory] = useState([]); // ✅ 시뮬레이션 결과 저장용

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        🎯 Lotto 전략 시뮬레이터
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ChartView history={history} />
          <DownloadLogs data={history} />
        </div>
        <div>
          <FilterSuggestion onSelectFilter={setSelectedFilter} />
          <StrategySimulator selectedFilter={selectedFilter} onHistoryUpdate={setHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;

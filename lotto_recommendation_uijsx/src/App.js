import React from "react";
import FilterSuggestion from "./components/FilterSuggestion";
import StrategySimulator from "./components/StrategySimulator";
import ChartView from "./components/ChartView";
import DownloadLogs from "./components/DownloadLogs";
import BestStrategy from "./components/BestStrategy";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-4">
          🎯 Lotto 전략 시뮬레이터
        </h1>

        <BestStrategy />
        <StrategySimulator />
        <ChartView data={[]} />
        <FilterSuggestion />
        <DownloadLogs />
      </div>
    </div>
  );
}

export default App;

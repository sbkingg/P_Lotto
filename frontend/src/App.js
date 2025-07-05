// src/App.js
import React, { useState } from "react";
import FilterSuggestion from "./components/FilterSuggestion";
import StrategySimulator from "./components/StrategySimulator";
import ChartView from "./components/ChartView";
import DownloadLogs from "./components/DownloadLogs";
import BestStrategy from "./components/BestStrategy";

function App() {
  const [selectedFilter, setSelectedFilter] = useState(""); // 필터 선택
  const [history, setHistory] = useState([]);               // 전체 로그
  const [filteredLogs, setFilteredLogs] = useState([]);     // 조건 필터링 로그

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        🎯 Lotto 전략 시뮬레이터
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 좌측: 시각화, 다운로드 */}
        <div className="space-y-4">
          <ChartView history={filteredLogs} /> {/* ✅ 조건 필터링 로그 전달 */}
          <DownloadLogs data={filteredLogs} />
        </div>

        {/* 우측: 필터 + 시뮬레이터 */}
        <div className="space-y-4">
          <FilterSuggestion onSelectFilter={setSelectedFilter} />
          <StrategySimulator
            selectedFilter={selectedFilter}
            onHistoryUpdate={(logs) => {
              setHistory(logs);
              setFilteredLogs(logs); // ✅ 조건 반영 로그 전달
            }}
          />
          <BestStrategy />
        </div>
      </div>
    </div>
  );
}

export default App;

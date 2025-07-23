// 📁 frontend/src/components/StrategyHub.js

import React, { useState, useEffect } from 'react';
import StrategySimulator from './StrategySimulator';
import MyStrategies from './MyStrategies';
import { downloadCSV, downloadStrategiesAsPDF } from "../utils/export_utils"; // ✅ PDF 저장 추가
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ autoTable 함수 직접 import

function StrategyHub() {
  const [selectedFilter, setSelectedFilter] = useState('기본값');
  const [history, setHistory] = useState([]);
  const [bestStrategies, setBestStrategies] = useState([]);
  const [evolvedStrategies, setEvolvedStrategies] = useState([]);
  const [userStrategies, setUserStrategies] = useState([]);
  const [bayesianStrategies, setBayesianStrategies] = useState([]);
  const [hybridStrategies, setHybridStrategies] = useState([]);

  const handleStrategyRestore = (strategy) => {
    console.log("복원된 전략:", strategy);
  };

  const fetchEvolved = () => {
    fetch("/api/evolve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvolvedStrategies(data.evolved_strategies || []);
      });
  };

  useEffect(() => {
    fetchEvolved();
  }, []);

  const allStrategies = [
    ...userStrategies,
    ...bestStrategies,
    ...evolvedStrategies,
    ...bayesianStrategies,
    ...hybridStrategies
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-800">🎯 로또 전략 통합 허브</h2>

      {/* 전략 시뮬레이터 */}
      <StrategySimulator
        selectedFilter={selectedFilter}
        onHistoryUpdate={(logs) => setHistory(logs)}
        onBayesianUpdate={(strategies) => setBayesianStrategies(strategies)}
      />

      {/* 전략 컨트롤 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          onClick={fetchEvolved}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
        >
          🔁 진화 전략 다시 실행
        </button>
        <button
          onClick={() => downloadCSV(allStrategies)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          📄 CSV 저장
        </button>
        <button
          onClick={() => downloadStrategiesAsPDF(allStrategies)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm"
        >
          🧾 PDF 저장
        </button>
      </div>

      {/* 전략 카드 뷰 */}
      <MyStrategies
        userStrategies={userStrategies}
        bestStrategies={bestStrategies}
        evolvedStrategies={evolvedStrategies}
        bayesianStrategies={bayesianStrategies}
        hybridStrategies={hybridStrategies}
        onSelect={handleStrategyRestore}
      />
    </div>
  );
}

export default StrategyHub;

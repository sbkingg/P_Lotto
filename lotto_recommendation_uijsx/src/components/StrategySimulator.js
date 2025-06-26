import React, { useState } from "react";
import axios from "axios";
import ChartView from "./ChartView";

function StrategySimulator() {
  const [strategy, setStrategy] = useState("proto");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runSimulation = () => {
    axios.post("/api/simulate", { strategy })
      .then(res => {
        setResults(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("시뮬레이션 실패:", err);
        setError("시뮬레이션에 실패했습니다.");
        setResults(null);
      });
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold">전략 시뮬레이션</h2>
      <select
        value={strategy}
        onChange={e => setStrategy(e.target.value)}
        className="border p-2 rounded mr-2"
      >
        <option value="proto">proto</option>
        <option value="v90">v90</option>
        <option value="random">random</option>
      </select>
      <button onClick={runSimulation} className="bg-blue-600 text-white px-4 py-2 rounded">
        시뮬레이션 실행
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {results && (
        <>
          <div className="mt-4">
            <h3 className="font-bold">결과 요약</h3>
            <p>평균 적중 수: {results.summary.average_match.toFixed(2)}</p>
            <ul>
              {results.results.map((r, idx) => (
                <li key={idx}>{r.round}: {r.matched}개 적중</li>
              ))}
            </ul>
          </div>
          <ChartView data={results.results} />
        </>
      )}
    </div>
  );
}

export default StrategySimulator;

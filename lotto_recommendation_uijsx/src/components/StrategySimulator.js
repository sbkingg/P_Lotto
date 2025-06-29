// components/StrategySimulator.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function StrategySimulator() {
  const [strategy, setStrategy] = useState('proto');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [best, setBest] = useState([]);

  const handleSimulate = () => {
    axios.post('/api/simulate', { strategy })
      .then(res => {
        setResult(res.data);
        fetchStats();
        fetchHistory();
        fetchBest();
      })
      .catch(() => setResult({ error: '시뮬레이션 실패' }));
  };

  const fetchHistory = () => {
    axios.get('/api/history')
      .then(res => {
        if (res.data && res.data.logs) setHistory(res.data.logs);
      });
  };

  const fetchStats = () => {
    axios.get('/api/stats')
      .then(res => {
        if (res.data) setStats(res.data);
      });
  };

  const fetchBest = () => {
    axios.get('/api/recommend-best')
      .then(res => {
        if (res.data && res.data.best_strategies) setBest(res.data.best_strategies);
      });
  };

  const handleDownload = () => {
    const csv = convertToCSV(history);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'simulation_logs.csv');
  };

  const convertToCSV = (logs) => {
    if (!logs.length) return '';
    const headers = Object.keys(logs[0]).join(',');
    const rows = logs.map(log => Object.values(log).join(',')).join('\n');
    return [headers, rows].join('\n');
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
    fetchBest();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">전략 시뮬레이터</h2>
        <select
          className="border rounded px-2 py-1 mr-2"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="proto">proto</option>
          <option value="v90">v90</option>
        </select>
        <button
          onClick={handleSimulate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          시뮬레이션 실행
        </button>
      </div>

      <div>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          CSV 다운로드
        </button>
      </div>

      {best.length > 0 && (
        <div className="text-sm">
          <h3 className="font-medium mt-2 mb-1">📌 추천 전략</h3>
            <ul className="list-disc ml-6">
              {best.map((s, i) => (
                <li key={i} className="text-indigo-700 font-medium">
                  {`${s.rank}위 - ${s.name} (score: ${s.score})`}
                </li>
              ))}
            </ul>
        </div>
      )}

      {stats && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">전략별 적중 수</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(stats).map(([name, count]) => ({ name, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {result && (
        <div className="text-sm text-gray-800">
          <h3 className="font-medium mt-4 mb-1">시뮬레이션 결과</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default StrategySimulator;

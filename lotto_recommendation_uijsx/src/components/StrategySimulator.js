// components/StrategySimulator.js
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

function StrategySimulator() {
  const [strategy, setStrategy] = useState('proto');
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    axios.post('/api/simulate', { strategy })
      .then(res => setResult(res.data))
      .catch(() => setResult({ error: '시뮬레이션 실패' }));
  };

  const handleDownload = () => {
    axios.get('/api/history')
      .then(res => {
        const csv = convertToCSV(res.data.logs || []);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'simulation_logs.csv');
      });
  };

  const convertToCSV = (logs) => {
    if (!logs.length) return '';
    const headers = Object.keys(logs[0]).join(',');
    const rows = logs.map(log => Object.values(log).join(',')).join('\n');
    return [headers, rows].join('\n');
  };

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
      {result && (
        <div className="text-sm text-gray-800">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default StrategySimulator;

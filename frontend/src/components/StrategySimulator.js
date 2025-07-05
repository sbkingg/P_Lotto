import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

function StrategySimulator({ selectedFilter, onHistoryUpdate }) {
  const [strategy, setStrategy] = useState('proto');
  const [result, setResult] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [minMatched, setMinMatched] = useState(0);
  const [stats, setStats] = useState(null);
  const [best, setBest] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSimulate = () => {
    setLoading(true);
    axios.post('/api/simulate', {
      strategy,
      filter: selectedFilter?.trim() || '기본값'
    })
    .then(res => {
      setResult(res.data);
      fetchStats();
      fetchBest();
      if (res.data.results) {
        setLocalHistory(res.data.results);
        const filtered = res.data.results.filter(r => Number(r.matched) >= minMatched);
        setFilteredLogs(filtered);
        if (typeof onHistoryUpdate === 'function') {
          onHistoryUpdate(filtered);
        }
      }
    })
    .catch((err) => {
      console.error('시뮬레이션 오류:', err);
      setResult({ error: '시뮬레이션 실패' });
    })
    .finally(() => setLoading(false));
  };

  const fetchHistory = () => {
    axios.get('/api/history')
      .then(res => {
        if (res.data?.logs) {
          setLocalHistory(res.data.logs);
          const filtered = res.data.logs.filter(r => Number(r.matched) >= minMatched);
          setFilteredLogs(filtered);
          if (typeof onHistoryUpdate === 'function') {
            onHistoryUpdate(filtered);
          }
        }
      });
  };

  const fetchStats = () => {
    const from = "2024-01-01";
    const to = "2025-12-31";
    axios.get(`/api/stats?from=${from}&to=${to}&minMatched=${minMatched}`)
      .then(res => {
        if (res.data) setStats(res.data);
      })
      .catch(err => console.error("[fetchStats error]", err));
  };

  const fetchBest = () => {
    axios.get('/api/recommend-best')
      .then(res => {
        if (res.data?.best_strategies) setBest(res.data.best_strategies);
      });
  };

  const convertToCSV = (logs) => {
    if (!logs.length) return '';
    const headers = Object.keys(logs[0]);
    const rows = logs.map(log =>
      headers.map(h => {
        const value = log[h];
        return h === 'date' ? `"${value}"` : value;
      }).join(',')
    ).join('\n');
    return [headers.join(','), rows].join('\n');
  };

  const handleDownload = () => {
    const csv = convertToCSV(localHistory);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'simulation_logs.csv');
  };

  const handleFilteredDownload = () => {
    const csv = convertToCSV(filteredLogs);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered_simulation_logs.csv');
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
    fetchBest();
  }, []);

  useEffect(() => {
    if (selectedFilter) {
      handleSimulate();
    }
  }, [selectedFilter]);

  useEffect(() => {
    const filtered = localHistory.filter(r => Number(r.matched) >= minMatched);
    setFilteredLogs(filtered);
    if (typeof onHistoryUpdate === 'function') {
      onHistoryUpdate(filtered);
    }
  }, [minMatched, localHistory, onHistoryUpdate]);

  const renderStatChart = (stats) => {
    const statData = Object.entries(stats).map(([name, values]) => ({
      name,
      평균: values.average,
      최대: values.max,
      최소: values.min
    }));

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={statData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="평균" fill="#60a5fa" />
          <Bar dataKey="최대" fill="#34d399" />
          <Bar dataKey="최소" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">전략 시뮬레이터</h2>
        <select
          className="border rounded px-2 py-1"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="proto">proto</option>
          <option value="v90">v90</option>
        </select>
        <input
          type="number"
          value={minMatched}
          min="0"
          max="6"
          onChange={(e) => setMinMatched(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
          placeholder="최소 적중수"
        />
        <button
          onClick={handleSimulate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          disabled={loading}
        >
          {loading ? '실행 중...' : '시뮬레이션 실행'}
        </button>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          전체 CSV
        </button>
        <button
          onClick={handleFilteredDownload}
          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
        >
          필터링된 CSV
        </button>
      </div>

      {best.length > 0 && (
        <div className="text-sm">
          <h3 className="font-medium mt-2 mb-1 text-pink-600">📌 추천 전략</h3>
          <ul className="list-disc ml-6">
            {best.map((s, i) => (
              <li key={i} className={i === 0 ? 'text-yellow-700 font-bold' : 'text-indigo-700 font-medium'}>
                {i === 0 && <span className="mr-1">⭐</span>}
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
            <BarChart
              data={Object.entries(stats).map(([name, values]) => ({
                name,
                count: values.count
              }))}
            >
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

      {stats && (
        <div className="mt-2">
          <h3 className="text-md font-medium mb-2">전략별 성능 요약 (평균/최대/최소)</h3>
          {renderStatChart(stats)}
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

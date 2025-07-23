// 📁 frontend/src/components/StrategySimulator.js (전체 교체용 최종본)

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import strategyLibrary from '../utils/strategy_library';

function StrategySimulator({ selectedFilter, onHistoryUpdate, onBayesianUpdate }) {
  const [strategy, setStrategy] = useState('proto');
  const [result, setResult] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [minMatched, setMinMatched] = useState(0);
  const [stats, setStats] = useState(null);
  const [best, setBest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [evolved, setEvolved] = useState([]);
  const [evolving, setEvolving] = useState(false);
  const initializedRef = useRef(false);

const handleSimulate = () => {
  setLoading(true);

  // ✅ 베이지안용 임시 past_draws
  const past_draws = [
    [1, 3, 12, 25, 33, 40],
    [7, 12, 19, 28, 33, 41],
    [2, 12, 14, 25, 39, 45],
    [5, 10, 19, 28, 33, 44],
  ];

  axios.post('/api/simulate', {
    strategy,
    filter: selectedFilter?.trim() || '기본값',
    past_draws: strategy === "bayesian" ? past_draws : undefined, // ✅ 조건부 포함
  })
  .then(res => {
    setResult(res.data);

    if (strategy === "bayesian" && typeof onBayesianUpdate === "function") {
      const strategies = (res.data.results || []).map((r, i) => ({
        name: `Bayes-${i + 1}`,
        numbers: r.numbers,
        score: res.data?.summary?.score || 0
      }));
      onBayesianUpdate(strategies);
    }

    setEvaluation(res.data?.summary || null);
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
      headers.map(h => log[h]).join(',')
    ).join('\n');
    return [headers.join(','), rows].join('\n');
  };

  const handleDownload = (filtered = false) => {
    setSaving(true);
    const data = filtered ? filteredLogs : localHistory;
    const csv = convertToCSV(data);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const filename = filtered ? 'filtered_simulation_logs.csv' : 'simulation_logs.csv';
    saveAs(blob, filename);
    setTimeout(() => setSaving(false), 500);
  };

  const handleEvolve = async () => {
    setEvolving(true);
    try {
      const response = await axios.post('/api/evolve', {
        base_strategy: best.map(s => s.numbers || []), // 추천 전략 기반 진화
        count: 5,
        mutation_rate: 0.3
      });
      setEvolved(response.data.evolved_strategies || []);
    } catch (err) {
      console.error('진화 실패:', err);
    } finally {
      setEvolving(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
    fetchBest();
  }, []);

  useEffect(() => {
    if (!initializedRef.current && selectedFilter) {
      initializedRef.current = true;
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
    <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 space-y-4 text-sm sm:text-base">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h2 className="text-base sm:text-lg font-semibold">전략 시뮬레이터</h2>
        <select
          className="border rounded px-2 py-1 w-full sm:w-auto"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="proto">proto</option>
          <option value="v90">v90</option>
          <option value="bayesian">bayesian</option> {/* ✅ 추가 */}
        </select>
        <input
          type="number"
          value={minMatched}
          min="0"
          max="6"
          onChange={(e) => setMinMatched(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full sm:w-28"
          placeholder="최소 적중수"
        />
        <button
          onClick={handleSimulate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? '실행 중...' : '시뮬레이션 실행'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handleDownload(false)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? '저장 중...' : '전체 CSV'}
        </button>
        <button
          onClick={() => handleDownload(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? '저장 중...' : '필터링된 CSV'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <button
          onClick={handleEvolve}
          disabled={evolving || best.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded w-full sm:w-auto"
        >
          {evolving ? '진화 중...' : '🧬 진화 전략 생성'}
        </button>
      </div>

      {best.length > 0 && (
        <div className="text-sm">
          <h3 className="font-medium mt-2 mb-1 text-pink-600">📌 추천 전략</h3>
          <ul className="list-disc ml-6">
            {best.map((s, i) => (
              <li key={i} className={`px-2 py-1 rounded ${i === 0 ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-indigo-700 font-medium'}`}>
                {i === 0 && <span className="mr-1">⭐</span>}
                {`${s.rank}위 - ${s.name} (score: ${s.score})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {evolved.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-indigo-700 mb-2">🧪 진화된 전략 목록</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            {evolved.map((nums, idx) => (
              <li key={idx}>
                전략 {idx + 1}: <span className="font-mono text-blue-700"> 
                  {Array.isArray(nums) ? nums.join(", ") : (typeof nums === 'string' ? nums : '-')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation && (
        <div className="bg-gray-50 p-3 border rounded">
          <h3 className="font-semibold mb-1">📈 전략 평가 요약</h3>
          <ul className="list-disc ml-5 text-sm">
            <li>평균 적중 수: <strong>{evaluation.average}</strong></li>
            <li>최대 적중 수: <strong>{evaluation.max}</strong></li>
            <li>최소 적중 수: <strong>{evaluation.min}</strong></li>
            <li>안정성: <strong>{evaluation.stability}</strong></li>
            <li>종합 점수: <strong className="text-blue-600">{evaluation.score}</strong></li>
          </ul>
        </div>
      )}

      {stats && (
        <>
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">전략별 적중 수</h3>
            {loading ? <div className="h-48 animate-pulse bg-gray-100 rounded" /> : (
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
            )}
          </div>

          <div className="mt-2">
            <h3 className="text-md font-medium mb-2">전략별 성능 요약 (평균/최대/최소)</h3>
            {loading ? <div className="h-48 animate-pulse bg-gray-100 rounded" /> : renderStatChart(stats)}
          </div>
        </>
      )}

      {result && (
        <div className="text-sm text-gray-800 break-words">
          <h3 className="font-medium mt-4 mb-1">시뮬레이션 결과</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default StrategySimulator;

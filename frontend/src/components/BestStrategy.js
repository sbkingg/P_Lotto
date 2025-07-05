// src/components/BestStrategy.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function BestStrategy() {
  const [stats, setStats] = useState(null);
  const [from, setFrom] = useState("2024-01-01");
  const [to, setTo] = useState("2025-12-31");
  const [minMatched, setMinMatched] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    axios
      .get(`/api/stats?from=${from}&to=${to}&minMatched=${minMatched}`)
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch((err) => console.error("[전략 통계 조회 실패]", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, [from, to, minMatched]); // ✅ 의존성 명시

  const data = stats
    ? stats.map((row) => ({
        name: row.strategy,
        평균: row.average,
        최대: row.max,
        최소: row.min,
      }))
    : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-blue-700">📊 전략 성능 비교</h2>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label>From:</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <label>matched ≥</label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-20"
          value={minMatched}
          min={0}
          max={6}
          onChange={(e) => setMinMatched(Number(e.target.value))}
        />
        <button
          onClick={fetchStats}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="평균" fill="#3b82f6" />
            <Bar dataKey="최대" fill="#10b981" />
            <Bar dataKey="최소" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-sm">
          데이터를 불러오는 중이거나 조건에 맞는 전략이 없습니다.
        </p>
      )}
    </div>
  );
}

export default BestStrategy;

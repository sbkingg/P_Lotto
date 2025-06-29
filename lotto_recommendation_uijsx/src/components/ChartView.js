// src/components/ChartView.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

function ChartView() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("2024-01-01");
  const [to, setTo] = useState("2025-12-31");

  // 👇 useCallback으로 fetchStats를 감싸 ESLint 경고 제거
  const fetchStats = useCallback(() => {
    axios.get(`/api/stats?from=${from}&to=${to}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.warn("Unexpected data format:", res.data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
      });
  }, [from, to]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]); // 🔧 경고 해결됨

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        전략별 적중 수 그래프
      </h2>

      {/* 날짜 선택 필터 */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label>
          From:{" "}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <button
          onClick={fetchStats}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          조회
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm mt-2">그래프 준비 중...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="strategy" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" name="평균 적중 수" />
            <Bar dataKey="max" fill="#82ca9d" name="최대 적중" />
            <Bar dataKey="min" fill="#ffc658" name="최소 적중" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ChartView;

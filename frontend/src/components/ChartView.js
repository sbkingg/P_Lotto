// src/components/ChartView.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";

function ChartView() {
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [from, setFrom] = useState("2024-01-01");
  const [to, setTo] = useState("2025-12-31");
  const [minMatched, setMinMatched] = useState(0);

  const processData = useCallback(
    (items) =>
      items.map((item) => ({
        ...item,
        label: `${item.strategy}+${item.filter}`,
      })),
    []
  );

  const fetchStats = useCallback(() => {
    axios
      .get("/api/stats", { params: { from, to, minMatched } })
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sorted = processData(res.data).sort((a, b) =>
            a.label.localeCompare(b.label)
          );
          setData(sorted);
        } else {
          console.warn("예상치 못한 응답 형식:", res.data);
        }
      })
      .catch((err) => {
        console.error("통계 조회 실패:", err);
      });
  }, [from, to, minMatched, processData]);

  const fetchHistory = useCallback(() => {
    axios
      .get("/api/history")
      .then((res) => {
        const logs = res.data?.logs || [];
        const group = {};
        logs.forEach((log) => {
          const key = log.date;
          const val = parseInt(log.matched);
          const strategy = log.strategy;
          if (!group[key]) group[key] = { date: key, proto: 0, v90: 0 };
          if (strategy === "proto") group[key].proto += val;
          else if (strategy === "v90") group[key].v90 += val;
        });
        setLineData(Object.values(group).sort((a, b) => a.date.localeCompare(b.date)));
      })
      .catch((err) => console.error("히스토리 불러오기 실패:", err));
  }, []);

  const handleDownload = () => {
    if (!data.length) return;
    const headers = ["label", "average", "max", "min", "count"];
    const sorted = [...data].sort((a, b) => a.label.localeCompare(b.label));
    const csv = [
      headers.join(","),
      ...sorted.map((row) =>
        headers.map((h) => `"${row[h] != null ? row[h] : ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const today = new Date().toISOString().slice(0, 10);
    saveAs(blob, `chart_stats_${today}.csv`);
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [fetchStats, fetchHistory]);

  const totalCount = data.reduce((sum, row) => sum + (row.count || 0), 0);
  const averageAll = data.length
    ? (data.reduce((sum, r) => sum + (r.average || 0), 0) / data.length).toFixed(2)
    : 0;
  const maxAll = Math.max(...data.map((r) => r.max ?? 0));
  const minAll = Math.min(...data.map((r) => r.min ?? 6));

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        📊 전략별 적중 수 그래프
      </h2>

      {/* 필터 영역 */}
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
        <label>
          matched ≥{" "}
          <input
            type="number"
            min={0}
            max={6}
            value={minMatched}
            onChange={(e) =>
              setMinMatched(Math.min(6, Math.max(0, parseInt(e.target.value) || 0)))
            }
            className="border rounded px-2 py-1 w-20"
          />
        </label>
        <button
          onClick={fetchStats}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          조회
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          CSV 저장
        </button>
      </div>

      {/* BarChart */}
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm mt-2">📭 통계 데이터가 없습니다.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-20} textAnchor="end" interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" name="평균 적중 수" />
            <Bar dataKey="max" fill="#82ca9d" name="최대 적중" />
            <Bar dataKey="min" fill="#ffc658" name="최소 적중" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* LineChart */}
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-1">📈 전략별 회차별 추이</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="proto" stroke="#1e3a8a" name="proto" />
            <Line type="monotone" dataKey="v90" stroke="#059669" name="v90" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 테이블 */}
      {data.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">📋 전략 요약 테이블</h3>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-1 text-left">전략+필터</th>
                <th className="border px-3 py-1">평균</th>
                <th className="border px-3 py-1">최대</th>
                <th className="border px-3 py-1">최소</th>
                <th className="border px-3 py-1">횟수</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-3 py-1">{row.label}</td>
                  <td className="border px-3 py-1 text-center">{row.average}</td>
                  <td className="border px-3 py-1 text-center">{row.max}</td>
                  <td className="border px-3 py-1 text-center">{row.min}</td>
                  <td className="border px-3 py-1 text-center">{row.count}</td>
                </tr>
              ))}
              {/* 요약행 */}
              <tr className="bg-yellow-100 font-semibold">
                <td className="border px-3 py-1 text-right">전체 평균:</td>
                <td className="border px-3 py-1 text-center">{averageAll}</td>
                <td className="border px-3 py-1 text-center">{maxAll}</td>
                <td className="border px-3 py-1 text-center">{minAll}</td>
                <td className="border px-3 py-1 text-center">{totalCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ChartView;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format, addDays } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";

function HistoryLog({ defaultFromDate, defaultToDate }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [strategyFilter, setStrategyFilter] = useState("전체");
  const [sourceFilter, setSourceFilter] = useState("전체");
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const fetchHistory = useCallback(async () => {
    try {
      const params = {
        from: fromDate,
        to: format(addDays(new Date(toDate), 1), "yyyy-MM-dd"),
      };
      if (strategyFilter !== "전체") params.strategy = strategyFilter;
      if (sourceFilter !== "전체") params.source = sourceFilter;

      const response = await axios.get("/api/history", { params });
      setHistory(response.data);
    } catch (error) {
      console.error("기록 불러오기 실패:", error);
    }
  }, [strategyFilter, sourceFilter, fromDate, toDate]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get("/api/stats", {
        params: {
          from: fromDate,
          to: format(addDays(new Date(toDate), 1), "yyyy-MM-dd"),
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("통계 불러오기 실패:", error);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [fetchHistory, fetchStats]);

  const downloadCSV = () => {
    const headers = ["날짜", "전략", "추천번호", "평균 점수"];
    const rows = history.map(item => [
      item.date, item.strategy, item.pickedNumbers, item.averageScore,
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "strategy_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredStats = Object.entries(stats).map(([strategy, values]) => ({
    strategy,
    최고: values.max,
    최저: values.min,
    평균: values.avg,
  }));

  return (
    <div className="mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📂 최근 시뮬레이션 기록</h2>

      {/* 필터 영역 */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select value={strategyFilter} onChange={e => setStrategyFilter(e.target.value)} className="border p-1">
          <option value="전체">전체</option>
          <option value="proto">proto</option>
          <option value="random">random</option>
          <option value="v90">v90</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="border p-1">
          <option value="전체">전체</option>
          <option value="직접입력">직접입력</option>
          <option value="AI추천">AI추천</option>
        </select>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border p-1" />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border p-1" />
        <button onClick={downloadCSV} className="bg-green-500 text-white px-3 py-1 rounded">
          CSV 다운로드
        </button>
      </div>

      {/* 통계 그래프 */}
      {filteredStats.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="strategy" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="최고" fill="#3498db" />
            <Bar dataKey="최저" fill="#e67e22" />
            <Bar dataKey="평균" fill="#2ecc71" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* 시뮬레이션 로그 테이블 */}
      <table className="w-full mt-4 text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">날짜</th>
            <th className="p-2 border">전략</th>
            <th className="p-2 border">추천번호</th>
            <th className="p-2 border">평균 점수</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">기록이 없습니다.</td>
            </tr>
          ) : (
            history.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border p-1">{item.date}</td>
                <td className="border p-1">{item.strategy}</td>
                <td className="border p-1">{item.pickedNumbers}</td>
                <td className="border p-1">{item.averageScore}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryLog;

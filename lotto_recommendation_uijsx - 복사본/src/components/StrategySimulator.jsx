// src/components/StrategyStats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function StrategyStats({ fromDate, toDate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats", {
          params: {
            from: fromDate,
            to: toDate,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("통계 데이터 불러오기 실패:", error);
        setStats(null);
      }
    };

    fetchStats();
  }, [fromDate, toDate]);

  const chartData = stats
    ? Object.entries(stats).map(([strategy, values]) => ({
        strategy,
        최고: values.max,
        최저: values.min,
        평균: values.avg,
      }))
    : [];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">📊 전략별 평균 적중률</h3>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
      ) : (
        <p className="text-gray-500 text-sm">표시할 통계가 없습니다.</p>
      )}
    </div>
  );
}

export default StrategyStats;

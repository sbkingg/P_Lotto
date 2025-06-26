// StrategyStats.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays } from "date-fns";
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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/stats", {
          params: {
            from: fromDate,
            to: format(addDays(new Date(toDate), 1), "yyyy-MM-dd"),
          },
        });

        const formatted = Object.entries(res.data).map(([strategy, stats]) => ({
          strategy,
          최고: stats.max,
          최저: stats.min,
          평균: stats.avg,
        }));
        setData(formatted);
      } catch (err) {
        console.error("전략 통계 불러오기 실패:", err);
      }
    };

    fetchStats();
  }, [fromDate, toDate]);

  return (
    <div className="mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">📊 전략별 평균 적중률</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
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
        <p>표시할 통계가 없습니다.</p>
      )}
    </div>
  );
}

export default StrategyStats;

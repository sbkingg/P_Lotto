import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

function StrategyStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get("/api/history").then((res) => {
      const data = res.data;
      const strategyMap = {};

      data.forEach((log) => {
        const key = log.strategy;
        const score = parseFloat(log.average_score);

        if (!strategyMap[key]) {
          strategyMap[key] = { total: 0, count: 0 };
        }

        strategyMap[key].total += score;
        strategyMap[key].count += 1;
      });

      const result = Object.keys(strategyMap).map((strategy) => ({
        strategy,
        average: (strategyMap[strategy].total / strategyMap[strategy].count).toFixed(2),
      }));

      setStats(result);
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">📊 전략별 평균 적중률</h2>
      <BarChart width={500} height={250} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="strategy" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="average" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default StrategyStats;

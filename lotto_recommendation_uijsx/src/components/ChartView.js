import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function ChartView({ data }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">전략별 적중 수 그래프</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="round" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="matched" fill="#8884d8" name="적중 수" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartView;

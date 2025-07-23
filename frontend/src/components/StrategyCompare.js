import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

function StrategyCompare({ strategies }) {
  // strategies: [{ name: 'proto', evaluation: { average, max, min, score, stability, variance, stddev } }, ...]

  const chartData = strategies.map(s => ({
    name: s.name,
    평균: parseFloat(s.evaluation.average),
    최대: parseFloat(s.evaluation.max),
    안정성: parseFloat(s.evaluation.stability),
    종합점수: parseFloat(s.evaluation.score),
    분산: parseFloat(s.evaluation.variance),
    표준편차: parseFloat(s.evaluation.stddev)
  }));

  return (
    <div className="bg-white rounded-md shadow p-4 space-y-4">
      <h2 className="text-lg font-semibold text-blue-600">📊 전략 비교 차트</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="종합점수" fill="#60a5fa" />
          <Bar dataKey="평균" fill="#4ade80" />
          <Bar dataKey="최대" fill="#facc15" />
          <Bar dataKey="안정성" fill="#f472b6" />
          <Bar dataKey="분산" fill="#a78bfa" />
          <Bar dataKey="표준편차" fill="#fb923c" />
        </BarChart>
      </ResponsiveContainer>

      <table className="w-full table-auto text-sm border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">전략명</th>
            <th className="border px-2 py-1">평균</th>
            <th className="border px-2 py-1">최대</th>
            <th className="border px-2 py-1">최소</th>
            <th className="border px-2 py-1">분산</th>
            <th className="border px-2 py-1">표준편차</th>
            <th className="border px-2 py-1">안정성</th>
            <th className="border px-2 py-1">점수</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((s, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-2 py-1 font-semibold text-indigo-600">{s.name}</td>
              <td className="border px-2 py-1">{s.evaluation.average}</td>
              <td className="border px-2 py-1">{s.evaluation.max}</td>
              <td className="border px-2 py-1">{s.evaluation.min}</td>
              <td className="border px-2 py-1">{s.evaluation.variance}</td>
              <td className="border px-2 py-1">{s.evaluation.stddev}</td>
              <td className="border px-2 py-1">{s.evaluation.stability}</td>
              <td className="border px-2 py-1 text-blue-600 font-bold">{s.evaluation.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StrategyCompare;

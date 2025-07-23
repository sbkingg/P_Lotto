// 📁 frontend/src/components/StrategyGenome.js

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', '#f472b6'];

function StrategyGenome({ patternData, strategyName }) {
  if (!patternData) return null;

  // 도넛차트용 데이터
  const highLowData = [
    { name: '상위번호', value: patternData.high_low_ratio },
    { name: '하위번호', value: 1 - patternData.high_low_ratio }
  ];

  const oddEvenData = [
    { name: '홀수', value: patternData.odd_even_ratio },
    { name: '짝수', value: 1 - patternData.odd_even_ratio }
  ];

  // 막대그래프용 데이터
  const barData = [
    { 항목: '연속번호 쌍', 값: patternData.consecutive_count },
    { 항목: '번호 평균', 값: patternData.avg_position }
  ];

  return (
    <div className="bg-white shadow rounded-md p-4 mt-4">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2">🧬 전략 유전자: {strategyName}</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">상/하위 비율</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={highLowData} dataKey="value" outerRadius={60} label>
                {highLowData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">홀/짝 비율</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={oddEvenData} dataKey="value" outerRadius={60} label>
                {oddEvenData.map((_, index) => (
                  <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-700 mb-1">기타 수치</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="항목" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="값" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600">
        고정 번호 포함 여부:{" "}
        <span className={`font-semibold ${patternData.has_fixed_number ? 'text-green-600' : 'text-red-500'}`}>
          {patternData.has_fixed_number ? '✔️ 포함됨' : '✘ 없음'}
        </span>
      </div>
    </div>
  );
}

export default StrategyGenome;

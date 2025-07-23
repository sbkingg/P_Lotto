// frontend/src/components/RecommendBest.js

import React from 'react';

function RecommendBest({ strategies }) {
  if (!strategies || strategies.length === 0) return null;

  // 최고 점수 전략 선택
  const best = strategies.reduce((prev, current) =>
    current.evaluation.score > prev.evaluation.score ? current : prev
  );

  return (
    <div className="bg-gradient-to-br from-blue-100 to-white border border-blue-300 rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-lg font-bold text-blue-700 mb-2">🏅 추천 전략</h2>

      <div className="border-2 border-blue-500 rounded-md bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-indigo-700">{best.name}</h3>
          <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded-full">✅ 추천 전략입니다!</span>
        </div>

        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>평균 적중 수:</strong> {best.evaluation.average}</li>
          <li><strong>최대 적중 수:</strong> {best.evaluation.max}</li>
          <li><strong>최소 적중 수:</strong> {best.evaluation.min}</li>
          <li><strong>표준편차:</strong> {best.evaluation.stddev}</li>
          <li><strong>안정성:</strong> {best.evaluation.stability}</li>
          <li className="font-bold text-blue-600"><strong>종합 점수:</strong> {best.evaluation.score}</li>
        </ul>
      </div>
    </div>
  );
}

export default RecommendBest;

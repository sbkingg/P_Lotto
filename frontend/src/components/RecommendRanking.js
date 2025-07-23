// frontend/src/components/RecommendRanking.js

import React from 'react';

function RecommendRanking({ strategies = [] }) {
  if (!strategies.length) return null;

  const sorted = [...strategies].sort((a, b) => b.evaluation.score - a.evaluation.score);

  return (
    <div className="bg-white shadow-md rounded-md p-4 mt-6">
      <h3 className="text-base font-semibold text-purple-600 mb-2">📈 전략 순위 목록</h3>
      <ol className="list-decimal ml-5 space-y-1">
        {sorted.map((s, idx) => (
          <li
            key={s.name}
            className={`font-medium ${idx === 0 ? 'text-yellow-600 font-bold' : 'text-gray-800'}`}
          >
            {idx === 0 && <span className="mr-1">⭐</span>}
            {s.name} — 종합점수: <span className="text-blue-600 font-semibold">{s.evaluation.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RecommendRanking;

// 📁 frontend/src/components/MyStrategies.js

import React, { useState, useEffect } from 'react';
import { saveStrategy, loadStrategies, deleteStrategy } from '../utils/strategy_store';

function MyStrategies({
  userStrategies = [],
  bestStrategies = [],
  evolvedStrategies = [],
  bayesianStrategies = [],
  hybridStrategies = [],
  onSelect
}) {
  const [savedStrategies, setSavedStrategies] = useState([]);

  useEffect(() => {
    setSavedStrategies(loadStrategies());
  }, []);

  const handleSave = (strategy) => {
    saveStrategy(strategy);
    setSavedStrategies(loadStrategies());
  };

  const handleDelete = (id) => {
    deleteStrategy(id);
    setSavedStrategies(loadStrategies());
  };

  const renderStrategyGroup = (title, strategies, type, icon, color, allowSave = false) => (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h3 className={`text-md font-semibold mb-2 ${color}`}>
        <span className="mr-1">{icon}</span> {title}
      </h3>
      {strategies.length === 0 ? (
        <p className="text-sm text-gray-400">전략 없음</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {strategies.map((s, idx) => {
            const name = s.name || `${type}-${idx + 1}`;
            const numbers = s.numbers || s;
            const score = s.score || s.evaluation?.score;
            return (
              <li
                key={idx}
                className="border border-gray-200 p-2 rounded hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div onClick={() => onSelect && onSelect(s)} className="cursor-pointer">
                    <div className="font-medium text-indigo-700">{name}</div>
                    <div className="font-mono text-sm text-gray-800 mt-1">
                      {Array.isArray(numbers) ? numbers.join(', ') : '번호 없음'}
                    </div>
                    {score !== undefined && (
                      <div className="text-xs text-green-600 mt-1">
                        종합 점수: <span className="font-bold">{score}</span>
                      </div>
                    )}
                  </div>
                  {allowSave && (
                    <button
                      onClick={() => handleSave(s)}
                      className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      저장
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {renderStrategyGroup('👤 사용자 전략', userStrategies, 'user', '👤', 'text-blue-800', true)}
      {renderStrategyGroup('🥇 추천 전략', bestStrategies, 'best', '🥇', 'text-blue-700', true)}
      {renderStrategyGroup('🧬 진화 전략', evolvedStrategies, 'evolved', '🧬', 'text-purple-700', true)}
      {renderStrategyGroup('🧠 베이지안 전략', bayesianStrategies, 'bayesian', '🧠', 'text-indigo-700', true)}
      {renderStrategyGroup('⚡ 하이브리드 전략', hybridStrategies, 'hybrid', '⚡', 'text-orange-600', true)}

      {/* 저장 전략 */}
      <div className="bg-white p-4 rounded shadow-md mb-4">
        <h3 className="text-md font-semibold mb-2 text-pink-700">💾 저장된 전략 목록</h3>
        {savedStrategies.length === 0 ? (
          <p className="text-sm text-gray-400">저장된 전략이 없습니다.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {savedStrategies.map((s) => (
              <li
                key={s.id}
                className="border border-gray-200 p-2 rounded flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-blue-600">{s.name}</div>
                  <div className="font-mono text-gray-800 text-sm">
                    {s.numbers?.join(', ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    저장일: {new Date(s.savedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={() => onSelect && onSelect(s)}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    복원
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyStrategies;

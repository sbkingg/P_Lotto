// 📁 frontend/src/components/StrategyCreator.js (전체 교체용)

import React, { useState } from 'react';

function StrategyCreator({ onCreate }) {
  const [name, setName] = useState('');
  const [topCount, setTopCount] = useState(20);
  const [minInclude, setMinInclude] = useState(3);
  const [maxInclude, setMaxInclude] = useState(5);

  const handleCreate = () => {
    if (!name.trim()) return alert('전략명을 입력해주세요.');
    if (minInclude > maxInclude) return alert('최소 포함 수는 최대보다 작아야 합니다.');

    const newStrategy = {
      name,
      logic: (numbers) => {
        const top = numbers.slice(0, topCount);
        return {
          include: top,
          range: [minInclude, maxInclude],
          mode: 'custom'
        };
      }
    };

    onCreate(newStrategy);
    setName('');
  };

  return (
    <div className="bg-white shadow p-4 rounded space-y-3 border mt-4">
      <h3 className="font-semibold text-blue-600">🛠️ 사용자 정의 전략 생성</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="전략 이름 (예: custom01)"
        />
        <input
          type="number"
          value={topCount}
          min={1}
          max={45}
          onChange={(e) => setTopCount(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          placeholder="상위 번호 개수"
        />
        <input
          type="number"
          value={minInclude}
          min={0}
          max={6}
          onChange={(e) => setMinInclude(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          placeholder="최소 포함 수"
        />
        <input
          type="number"
          value={maxInclude}
          min={0}
          max={6}
          onChange={(e) => setMaxInclude(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          placeholder="최대 포함 수"
        />
      </div>
      <button
        onClick={handleCreate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
      >
        전략 등록
      </button>
    </div>
  );
}

export default StrategyCreator;

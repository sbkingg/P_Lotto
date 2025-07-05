import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FilterSuggestion({ onSelectFilter }) {
  const [filters, setFilters] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔄 필터 목록 가져오기
  useEffect(() => {
    axios.get('/api/recommend-filters')
      .then((res) => {
        const list = res.data?.filters || [];
        setFilters(list);
        if (list.length > 0) {
          setSelected(list[0].name);
          if (typeof onSelectFilter === 'function') {
            onSelectFilter(list[0].name);
          }
        }
      })
      .catch((err) => console.error('[필터 목록 로드 실패]', err));
  }, [onSelectFilter]);

  // ⭐ 추천 전략 목록
  useEffect(() => {
    axios.get('/api/recommend-best')
      .then((res) => {
        if (res.data?.best_strategies) {
          const names = res.data.best_strategies.map(s => s.name);
          setRecommended(names);
        }
      })
      .catch((err) => console.error('[추천 전략 불러오기 실패]', err));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (typeof onSelectFilter === 'function') {
      onSelectFilter(value);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">추천 필터 목록</h2>
      {filters.length === 0 ? (
        <p className="text-sm text-gray-500">불러온 필터가 없습니다.</p>
      ) : (
        <>
          <select
            className="border px-2 py-1 rounded w-full mb-2"
            value={selected || ''}
            onChange={handleChange}
          >
            {filters.map((filter, idx) => (
              <option key={idx} value={filter.name}>
                {filter.name} - {filter.description}
              </option>
            ))}
          </select>
          <ul className="list-disc list-inside space-y-1">
            {filters.map((filter, idx) => {
              const isRecommended = recommended.includes(filter.name);
              return (
                <li key={idx} className={`text-sm ${isRecommended ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                  {isRecommended && <span className="mr-1">⭐️</span>}
                  {filter.name} - {filter.description}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default FilterSuggestion;

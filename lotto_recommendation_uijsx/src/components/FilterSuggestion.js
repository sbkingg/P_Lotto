// components/FilterSuggestion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FilterSuggestion({ onSelectFilter }) {
  const [filters, setFilters] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [selected, setSelected] = useState(null);

  // 필터 목록 요청
  useEffect(() => {
    axios.get('/api/recommend-filters')
      .then(response => {
        const filterList = response.data.filters || [];
        setFilters(filterList);
        if (filterList.length > 0) {
          setSelected(filterList[0].name);
          onSelect && onSelect(filterList[0].name);  // 기본 선택 전달
        }
      })
      .catch(error => console.error("필터 불러오기 실패:", error));
  }, []);

  // 추천 전략 요청
  useEffect(() => {
    axios.get('/api/recommend-best')
      .then(response => {
        if (response.data?.best_strategies) {
          const names = response.data.best_strategies.map(s => s.name);
          setRecommended(names);
        }
      })
      .catch(error => console.error("추천 전략 불러오기 실패:", error));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onSelect && onSelect(value);
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

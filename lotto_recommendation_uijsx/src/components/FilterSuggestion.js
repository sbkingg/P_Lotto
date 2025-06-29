import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FilterSuggestion() {
  const [filters, setFilters] = useState([]);
  const [recommended, setRecommended] = useState([]);

  // 📌 필터 목록 요청
  useEffect(() => {
    axios.get('/api/recommend-filters')
      .then(response => {
        console.log("필터 확인:", response.data);
        setFilters(response.data.filters || []);
      })
      .catch(error => {
        console.error("필터 불러오기 실패:", error);
      });
  }, []);

  // 📌 추천 전략 요청
  useEffect(() => {
    axios.get('/api/recommend-best')
      .then(response => {
        if (response.data?.best_strategies) {
          const names = response.data.best_strategies.map(s => s.name);
          setRecommended(names);
        }
      })
      .catch(error => {
        console.error("추천 전략 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">추천 필터 목록</h2>
      {filters.length === 0 ? (
        <p className="text-sm text-gray-500">불러온 필터가 없습니다.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {filters.map((filter, idx) => {
            const isRecommended = recommended.includes(filter.name);
            return (
              <li key={idx} className={`text-sm ${isRecommended ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                {isRecommended && <span className="mr-1">⭐️</span>}
                {filter?.name || "이름없음"} - {filter?.description || "설명 없음"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FilterSuggestion;

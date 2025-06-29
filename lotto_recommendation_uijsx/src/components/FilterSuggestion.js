// components/FilterSuggestion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FilterSuggestion() {
  const [filters, setFilters] = useState([]);

useEffect(() => {
  axios.get('/api/recommend-filters')
    .then(response => {
      console.log("필터 확인:", response.data); // 로그 확인!
      setFilters(response.data.filters || []); // null 방지
    })
    .catch(error => {
      console.error("필터 불러오기 실패:", error);
    });
}, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">추천 필터 목록</h2>
      {filters.length === 0 ? (
        <p className="text-sm text-gray-500">불러온 필터가 없습니다.</p>
      ) : (
        <ul className="list-disc list-inside">
          {filters.map((filter, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              {filter?.name || "이름없음"} - {filter?.description || "설명 없음"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterSuggestion;

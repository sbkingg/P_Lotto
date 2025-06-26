import React, { useEffect, useState } from "react";
import axios from "axios";

const FilterSuggestion = () => {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    axios
      .get("/api/recommend-filters")
      .then((res) => setFilters(res.data.filters || []))
      .catch((err) => {
        console.error("필터 추천 불러오기 실패", err);
      });
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">추천 필터 목록</h2>
      {filters.length === 0 ? (
        <p className="text-gray-500">불러온 필터가 없습니다.</p>
      ) : (
        <ul className="list-disc pl-6 text-sm">
          {filters.map((filter, idx) => (
            <li key={idx}>✔ {filter.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterSuggestion;

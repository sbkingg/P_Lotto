import React, { useEffect, useState } from "react";
import axios from "axios";

function FilterSuggestion() {
  const [suggestedFilters, setSuggestedFilters] = useState([]);

  const handleAutoRecommend = async () => {
    try {
      const response = await axios.get("/api/recommend-best");
      setSuggestedFilters(response.data.best_strategies);
    } catch (error) {
      alert("추천 전략을 불러오지 못했습니다.");
    }
  };

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
      <button onClick={handleAutoRecommend}>전략 추천 받아보기</button>
      {suggestedFilters.length > 0 && (
        <ul>
          {suggestedFilters.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterSuggestion;
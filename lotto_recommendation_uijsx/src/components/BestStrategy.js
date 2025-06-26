import React, { useEffect, useState } from "react";
import axios from "axios";

function BestStrategy() {
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    axios.get("/api/recommend-best")
      .then(res => setRecommendation(res.data))
      .catch(err => console.error("전략 추천 실패:", err));
  }, []);

  if (!recommendation) return <p>전략 추천 정보를 불러오는 중...</p>;

  return (
    <div className="mt-6 p-4 border rounded shadow">
      <h2 className="text-lg font-bold">📌 자동 추천 전략</h2>
      <p>
        <strong>추천 전략:</strong> {recommendation.recommended_strategy}<br />
        <strong>평균 적중 수:</strong> {recommendation.average_matched.toFixed(2)}<br />
        <strong>실행 횟수:</strong> {recommendation.total_runs}
      </p>
    </div>
  );
}

export default BestStrategy;

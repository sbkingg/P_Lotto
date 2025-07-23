// 📁 src/utils/evaluation.js

function evaluateStrategy(results) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const matchedArray = results.map(r => Number(r.matched));
  const total = matchedArray.length;

  const average = matchedArray.reduce((a, b) => a + b, 0) / total;
  const max = Math.max(...matchedArray);
  const min = Math.min(...matchedArray);

  const variance = matchedArray.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / total;
  const stddev = Math.sqrt(variance);
  const stability = 1 - (stddev / 6); // 6은 최대값 기준 정규화

  return {
    average: average.toFixed(2),
    max,
    min,
    stability: stability.toFixed(2),
    score: (average * 0.7 + max * 0.2 + stability * 0.1).toFixed(2)
  };
}

export default evaluateStrategy;

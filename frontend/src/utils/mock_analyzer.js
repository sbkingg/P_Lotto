// 📁 frontend/src/utils/mock_analyzer.js
// 전략 번호 배열 → 패턴 정보로 변환 (프론트 단 시뮬레이터용)
export function analyzePattern(numbers) {
  const total = numbers.length;
  const high = numbers.filter(n => n >= 23).length;
  const odd = numbers.filter(n => n % 2 === 1).length;
  let consecutive = 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === 1) consecutive++;
  }

  return {
    high_low_ratio: +(high / total).toFixed(2),
    odd_even_ratio: +(odd / total).toFixed(2),
    consecutive_count: consecutive,
    has_fixed_number: numbers.includes(7),
    avg_position: +(numbers.reduce((a, b) => a + b, 0) / total).toFixed(2)
  };
}

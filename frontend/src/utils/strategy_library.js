// 📁 src/utils/strategy_library.js

// 전략 정의 모듈

const strategyLibrary = {
  proto: (numbers) => applyTopNFilter(numbers, 20, 3, 5),
  v90: (numbers) => applyTopNFilter(numbers, 20, 2, 5),
  hybrid: (numbers) => applyBayesianFilter(numbers),
};

function applyTopNFilter(numbers, topCount, min, max) {
  const topNumbers = numbers.slice(0, topCount);
  return {
    include: topNumbers,
    range: [min, max],
    mode: "frequency"
  };
}

function applyBayesianFilter(numbers) {
  return {
    type: "bayesian",
    params: { alpha: 1.0, beta: 1.0 }
  };
}

export default strategyLibrary;

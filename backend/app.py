
# App.js
import React from 'react';
import FilterSuggestion from './components/FilterSuggestion';
import StrategySimulator from './components/StrategySimulator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
#       🎯 Lotto <span className="text-indigo-700">전략 시뮬레이터</span>
        </h1>
      </header>
      <main className="grid md:grid-cols-2 gap-6">
        <FilterSuggestion />
        <StrategySimulator />
      </main>
    </div>
  );
}

export default App;

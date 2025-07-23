// 📁 frontend/src/utils/strategy_store.js

const STORAGE_KEY = 'saved_strategies';

export function saveStrategy(strategy) {
  if (!strategy || !strategy.name || !strategy.numbers) return;

  const stored = loadStrategies();
  const newEntry = {
    ...strategy,
    id: `${strategy.name}-${Date.now()}`,
    savedAt: new Date().toISOString()
  };
  const updated = [...stored, newEntry];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadStrategies() {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteStrategy(id) {
  const stored = loadStrategies();
  const updated = stored.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllStrategies() {
  localStorage.removeItem(STORAGE_KEY);
}

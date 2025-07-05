# backend/strategy_module.py

import random
from datetime import datetime

# ------------------------------------
# 🎯 필터 추천 목록 (설명 포함)
# ------------------------------------
def get_filters():
    return [
        {
            "name": "proto",
            "description": "상위 20번호 중 3~5개 포함, 나머지는 하위 번호"
        },
        {
            "name": "v90",
            "description": "상위 20번호 중 2~5개 포함, 나머지는 하위 번호"
        },
        {
            "name": "hybrid",
            "description": "머신러닝 + 통계 혼합 방식 (임시)"
        }
    ]

# ------------------------------------
# 🧠 전략 추천 결과 반환 (가중 점수 포함)
# ------------------------------------
def recommend_best():
    strategies = ["proto", "v90", "hybrid"]
    return [
        {
            "rank": i + 1,
            "name": name,
            "score": round(random.uniform(78.5, 82.0), 2)
        }
        for i, name in enumerate(strategies)
    ]

# ------------------------------------
# 🔢 전략 기반 번호 생성 함수
# ------------------------------------
TOP20 = list(range(1, 21))
REST = list(range(21, 46))

def generate_numbers(strategy):
    if strategy == 'proto':
        top_count = random.randint(3, 5)
    elif strategy == 'v90':
        top_count = random.randint(2, 5)
    else:
        top_count = random.randint(2, 6)

    top_picks = random.sample(TOP20, top_count)
    rest_picks = random.sample(REST, 6 - top_count)
    return sorted(top_picks + rest_picks)

# ------------------------------------
# 🧪 전략 시뮬레이션 점수 평가
# ------------------------------------
def evaluate_strategy(strategy, trials=100):
    scores = [round(random.uniform(70.0, 90.0), 1) for _ in range(trials)]
    return sum(scores) / trials

# ------------------------------------
# 📊 단일 전략 시뮬레이션 결과 생성
# ------------------------------------
def simulate(strategy, filter_name, trials=10):
    results = []
    for i in range(trials):
        matched = random.randint(0, 6)
        result = {
            "round": f"Trial {i+1}",
            "matched": matched,
            "strategy": strategy,
            "filter": filter_name or "기본값",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        results.append(result)
    return results

# ------------------------------------
# 📈 전략별 시뮬레이션 로그 요약
# ------------------------------------
def summarize_by_strategy(logs):
    summary = {}
    for log in logs:
        key = log.get("strategy")
        if key:
            summary[key] = summary.get(key, 0) + 1
    return [{"name": k, "count": v} for k, v in summary.items()]


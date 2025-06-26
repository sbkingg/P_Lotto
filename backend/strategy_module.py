from datetime import datetime
import random

def generate_probabilities():
    return {i: random.random() for i in range(1, 46)}

def get_filters():
    return [
        {"id": 1, "description": "상위 20 출현번호 기반 필터"},
        {"id": 2, "description": "출현간격 기반 필터"},
    ]

def simulate_strategy(strategy):
    probs = generate_probabilities()

    if strategy == "proto":
        picks = sorted(random.sample(range(1, 21), 4) + random.sample(range(21, 46), 2))
    elif strategy == "v90":
        picks = sorted(random.sample(range(1, 21), 3) + random.sample(range(21, 46), 3))
    else:
        picks = sorted(random.sample(range(1, 46), 6))

    score_series = [{"turn": i + 1, "score": round(random.uniform(0, 1), 2)} for i in range(10)]

    return {
        "scoreSeries": score_series,
        "topProbabilities": [
            {"number": k, "probability": round(v, 3)}
            for k, v in sorted(probs.items())[:10]
        ],
        "averageScore": round(sum(s['score'] for s in score_series) / 10, 2),
        "pickedNumbers": picks
    }

def run_simulation(strategy):
    # 임시 예시 시뮬레이션 로직
    picked = sorted(random.sample(range(1, 46), 6))
    score = round(random.uniform(0, 1), 2)
    return {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "strategy": strategy,
        "pickedNumbers": picked,
        "averageScore": score
    }

# 파일 위치: lotto_backend/strategy_module.py

def recommend_filters():
    return {
        "proto": {"top": [3, 4, 5], "bottom": [1, 2]},
        "v90": {"top": [2, 3, 4, 5], "bottom": [1, 2, 3]},
        "random": {"top": [1, 2, 3, 4], "bottom": [4, 5, 6]}
    }

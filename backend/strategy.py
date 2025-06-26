# strategy.py
import random

# 상위 출현 번호 (예시용)
TOP20 = list(range(1, 21))
REST = list(range(21, 46))

def generate_numbers(strategy: str):
    """
    전략에 따라 번호 조합 생성
    - proto: TOP20 중 3~5개 포함
    - v90: TOP20 중 2~5개 포함
    """
    if strategy == 'proto':
        top_count = random.randint(3, 5)
    elif strategy == 'v90':
        top_count = random.randint(2, 5)
    else:
        top_count = random.randint(2, 6)

    top_picks = random.sample(TOP20, top_count)
    rest_picks = random.sample(REST, 6 - top_count)

    return sorted(top_picks + rest_picks)

def simulate_strategy(strategy: str, trials=100):
    """
    지정된 전략으로 trials 횟수 시뮬레이션 수행 후 평균 점수 반환
    (현재는 점수를 랜덤으로 대체함)
    """
    results = []
    for _ in range(trials):
        numbers = generate_numbers(strategy)
        score = round(random.uniform(70.0, 90.0), 1)  # 임시 점수
        results.append(score)

    return sum(results) / len(results)

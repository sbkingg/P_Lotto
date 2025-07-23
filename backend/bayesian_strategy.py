# 📁 backend/bayesian_strategy.py

import random
from collections import Counter
import numpy as np

LOTTO_RANGE = range(1, 46)  # 로또 번호 1~45

def calculate_posterior(past_draws, prior=None):
    """
    과거 당첨번호 기반으로 각 번호의 사후확률 계산
    - past_draws: [[1, 3, 12, 25, 33, 40], ...] (최근 N회차)
    - prior: 초기 사전확률 (없으면 균등분포 사용)
    """
    if not past_draws:
        return {n: 1/45 for n in LOTTO_RANGE}

    prior = prior or {n: 1/45 for n in LOTTO_RANGE}
    flat_numbers = [n for draw in past_draws for n in draw]
    freq = Counter(flat_numbers)

    total_count = sum(freq.values())
    likelihood = {n: freq.get(n, 0) / total_count for n in LOTTO_RANGE}

    # 사후확률: prior * likelihood
    posterior = {
        n: prior[n] * likelihood.get(n, 1e-6) for n in LOTTO_RANGE
    }

    # 정규화
    total = sum(posterior.values())
    posterior = {n: p / total for n, p in posterior.items()}

    return posterior


def recommend_numbers(past_draws, count=1, picks_per_set=6):
    """
    베이지안 사후확률 기반 추천 번호 조합
    - count: 몇 개 조합을 추천할지
    - picks_per_set: 조합당 몇 개 번호
    """
    posterior = calculate_posterior(past_draws)
    numbers, probs = zip(*posterior.items())

    recommended = []
    for _ in range(count):
        picks = np.random.choice(numbers, size=picks_per_set, replace=False, p=probs)
        recommended.append(sorted(map(int, picks)))

    return recommended

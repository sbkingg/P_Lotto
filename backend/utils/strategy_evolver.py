# 📁 backend/utils/strategy_evolver.py

import random

def evolve_strategies(base_strategies, pool_size=10, mutation_rate=0.2):
    """
    여러 전략을 교차, 돌연변이하여 새로운 전략을 자동 생성함.
    
    Parameters:
        base_strategies: List[List[int]] - 기본 전략 번호 목록들
        pool_size: int - 생성할 전략 개수
        mutation_rate: float (0~1) - 돌연변이 확률

    Returns:
        List[List[int]] - 새롭게 진화된 전략들
    """
    evolved = []

    if not base_strategies or not isinstance(base_strategies, list):
        return evolved

    for _ in range(pool_size):
        # 부모 전략 2개 무작위 선택
        parent1 = random.choice(base_strategies)
        parent2 = random.choice(base_strategies)

        # 교차: 절반씩 번호를 가져와 조합
        mid = len(parent1) // 2
        child = list(set(parent1[:mid] + parent2[mid:]))

        # 부족한 번호 랜덤 보충 (중복X)
        while len(child) < 6:
            n = random.randint(1, 45)
            if n not in child:
                child.append(n)

        # 돌연변이: mutation_rate 확률로 번호 1~2개 랜덤 교체
        if random.random() < mutation_rate:
            for _ in range(random.randint(1, 2)):
                idx = random.randint(0, 5)
                new_num = random.randint(1, 45)
                while new_num in child:
                    new_num = random.randint(1, 45)
                child[idx] = new_num

        child.sort()
        evolved.append(child)

    return evolved

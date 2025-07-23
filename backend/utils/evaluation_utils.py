# 📁 backend/utils/evaluation_utils.py (전체 교체용)

import numpy as np

def evaluate_strategy(results):
    """
    전략 결과 리스트를 받아 다양한 평가 지표를 반환함.
    results: [{ matched: int, ... }, ...]
    """
    if not results:
        return {
            "count": 0,
            "average": 0,
            "max": 0,
            "min": 0,
            "variance": 0,
            "stddev": 0,
            "stability": 0,
            "score": 0
        }

    matched = [int(r.get("matched", 0)) for r in results]
    count = len(matched)
    avg = float(np.mean(matched))
    max_v = int(np.max(matched))
    min_v = int(np.min(matched))
    var = float(np.var(matched))
    std = float(np.std(matched))

    # 안정성: 분산 기반으로 계산 (분산이 작을수록 안정적)
    stability = round(1 / (1 + std), 4)

    # 종합 점수: 평균 + 안정성 보정치 + max/avg 보정항
    score = round(avg + stability * 2 + (max_v / (avg + 1e-5)) * 0.2, 4)

    return {
        "count": count,
        "average": round(avg, 2),
        "max": max_v,
        "min": min_v,
        "variance": round(var, 4),
        "stddev": round(std, 4),
        "stability": stability,
        "score": score
    }

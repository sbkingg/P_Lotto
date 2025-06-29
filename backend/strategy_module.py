# backend/strategy_module.py

def get_filters():
    """
    전략 필터 목록을 반환합니다.
    추후 DB 기반 또는 사용자 맞춤형 분석 필터로 확장 가능합니다.
    """
    try:
        filters = [
            {"name": "proto", "description": "상위 20번호 중 3~5개 포함, 나머지는 하위 번호"},
            {"name": "v90", "description": "상위 20번호 중 2~5개 포함, 나머지는 하위 번호"},
            {"name": "hybrid", "description": "머신러닝 + 통계 혼합 방식"}
        ]
        return filters
    except Exception as e:
        return [{"name": "error", "description": str(e)}]


def recommend_best():
    """
    성능 기반 전략 추천을 반환합니다.
    실제 서비스에서는 시뮬레이션 결과 또는 분석 데이터를 기반으로 동작할 수 있습니다.
    현재는 score 기반 정렬 + rank 부여 구조입니다.
    """
    try:
        # 예시 데이터 (향후 get_stats 등 외부 연동 가능)
        strategies = [
            {"name": "proto", "score": 89.2},
            {"name": "v90", "score": 85.7},
            {"name": "hybrid", "score": 78.4}
        ]

        # score 기준으로 내림차순 정렬 및 순위 부여
        ranked = sorted(strategies, key=lambda s: s["score"], reverse=True)

        for i, strategy in enumerate(ranked):
            strategy["rank"] = i + 1

        return ranked

    except Exception as e:
        return [{"name": "error", "score": 0.0, "rank": -1, "error": str(e)}]

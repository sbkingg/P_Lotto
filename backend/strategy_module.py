# strategy_module.py

def get_filters():
    """
    전략 필터 목록을 반환하는 예시 함수입니다.
    실제 서비스에서는 DB 조회 또는 분석 기반 동적 구성 가능.
    """
    return [
        {"name": "proto", "description": "상위 20개 중 3~5개 포함"},
        {"name": "v90", "description": "상위 20개 중 2~5개 포함"},
        {"name": "hybrid", "description": "통계 기반 혼합 전략"},
    ]


def recommend_best():
    """
    전략 추천 API에서 사용하는 베스트 전략 반환 함수입니다.
    실제 성능 데이터 기반 정렬이 가능하도록 후처리 확장 가능.
    """
    return [
        {"name": "proto", "score": 89.2},
        {"name": "v90", "score": 85.7},
        {"name": "hybrid", "score": 78.4}
    ]

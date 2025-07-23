# 📁 backend/utils/strategy_patterns.py

def analyze_strategy_pattern(strategy_numbers):
    """
    전략 번호 리스트를 받아 주요 패턴 지표를 추출한다.
    strategy_numbers: List[int] (ex: [3, 8, 14, 23, 27, 41])

    Returns:
        dict with keys:
        - high_low_ratio: float
        - odd_even_ratio: float
        - consecutive_count: int
        - has_fixed_number: bool
        - avg_position: float
    """
    if not strategy_numbers or not isinstance(strategy_numbers, list):
        return {}

    sorted_nums = sorted(strategy_numbers)
    total = len(sorted_nums)

    # 상하위 번호 기준 (1~22 하위 / 23~45 상위)
    high = len([n for n in sorted_nums if n >= 23])
    low = total - high
    high_low_ratio = round(high / total, 2)

    # 홀짝 비율
    odd = len([n for n in sorted_nums if n % 2 == 1])
    even = total - odd
    odd_even_ratio = round(odd / total, 2)

    # 연속 번호 개수 (예: 7,8,9 → 연속 2쌍)
    consecutive_count = 0
    for i in range(1, total):
        if sorted_nums[i] - sorted_nums[i - 1] == 1:
            consecutive_count += 1

    # 고정 번호 포함 여부 (예: 항상 포함하는 특정 번호 - 임시로 7로 예시)
    has_fixed_number = 7 in sorted_nums

    # 번호 평균 위치
    avg_position = round(sum(sorted_nums) / total, 2)

    return {
        "high_low_ratio": high_low_ratio,
        "odd_even_ratio": odd_even_ratio,
        "consecutive_count": consecutive_count,
        "has_fixed_number": has_fixed_number,
        "avg_position": avg_position
    }

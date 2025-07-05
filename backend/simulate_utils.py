
import os
import random
import csv
from datetime import datetime

# 로그 저장 경로 상수
LOG_PATH = "logs/simulation_logs.csv"


# -------------------------------
# [1] 전략 시뮬레이션 실행 함수
# -------------------------------
def simulate_strategy(strategy_name, filter_name=None):
    """
    전략 이름과 필터명을 기반으로 10회 시뮬레이션 실행.
    각 시뮬레이션은 0~6 사이의 무작위 적중 수를 생성하며,
    결과는 logs 디렉토리에 CSV로 기록됨.
    """
    results = []
    for i in range(10):
        match = random.randint(0, 6)
        results.append({
            "round": f"Trial {i + 1}",
            "matched": match,
            "strategy": strategy_name,
            "filter": filter_name or "기본값",
            "date": datetime.now().strftime("%Y-%m-%d")
        })

    avg = sum(r["matched"] for r in results) / len(results)
    summary = {
        "average_match": avg,
        "total_runs": len(results)
    }

    save_history(results)
    return {"results": results, "summary": summary}


# -------------------------------
# [2] 시뮬레이션 결과 로그 저장
# -------------------------------
def save_history(rows):
    """
    시뮬레이션 결과를 CSV로 저장. 새 파일일 경우 헤더 포함.
    """
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    is_new_file = not os.path.exists(LOG_PATH)

    with open(LOG_PATH, "a", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["date", "round", "strategy", "matched", "filter"]
        )
        if is_new_file or os.path.getsize(LOG_PATH) == 0:
            writer.writeheader()
        for row in rows:
            writer.writerow({
                "date": row.get("date", ""),
                "round": row.get("round", ""),
                "strategy": row.get("strategy", ""),
                "matched": row.get("matched", ""),
                "filter": row.get("filter", "기본값")
            })


# -------------------------------
# [3] CSV 로그 불러오기
# -------------------------------
def load_history():
    """
    로그 파일을 불러와 리스트로 반환.
    필수 필드 누락 시 해당 행은 무시.
    """
    records = []

    try:
        with open(LOG_PATH, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if "date" in row and "matched" in row and "strategy" in row:
                    records.append(row)
    except FileNotFoundError:
        # 로그 파일이 처음인 경우
        pass

    return records


# -------------------------------
# [4] 통계 요약 계산
# -------------------------------
def get_stats(from_date, to_date, min_matched=0):
    """
    지정된 날짜 범위(from_str~to_str)와 최소 적중 수(min_matched)를 바탕으로
    전략+필터 조합별 평균/최대/최소/횟수 통계를 계산.
    from_date, to_date: datetime.date 객체
    min_matched: int (기본값 0)
    """

    data = load_history()
    filtered = []

    for r in data:
        try:
            row_date = datetime.strptime(r["date"], "%Y-%m-%d").date()
            if from_date <= row_date <= to_date:
                if int(r["matched"]) >= min_matched:
                    filtered.append(r)
        except (ValueError, KeyError):
            continue  # 날짜 또는 matched 이상 시 건너뜀

    stat = {}
    for row in filtered:
        key = f"{row['strategy']}+{row.get('filter', '기본값')}"
        try:
            matched = float(row["matched"])
        except (ValueError, KeyError):
            continue

        if key not in stat:
            stat[key] = {"total": 0, "count": 0, "max": 0, "min": 6}
        stat[key]["total"] += matched
        stat[key]["count"] += 1
        stat[key]["max"] = max(stat[key]["max"], matched)
        stat[key]["min"] = min(stat[key]["min"], matched)

    summary = []
    for k, v in stat.items():
        strategy, filter_name = k.split("+", 1)
        summary.append({
            "strategy": strategy,
            "filter": filter_name,
            "average": round(v["total"] / v["count"], 2) if v["count"] > 0 else 0,
            "max": v["max"],
            "min": v["min"],
            "count": v["count"]
        })

    return summary
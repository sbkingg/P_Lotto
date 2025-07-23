# backend/simulate_utils.py
import os
import random
import csv
from datetime import datetime
from utils.evaluation_utils import evaluate_strategy
from bayesian_strategy import recommend_numbers

LOG_PATH = "logs/simulation_logs.csv"


def simulate_strategy(strategy_name, filter_name=None, past_draws=None):
    results = []

    if strategy_name == "bayesian":
        if not past_draws:
            return {
                "error": "베이지안 전략은 past_draws (최근 당첨번호 목록)가 필요합니다.",
                "results": [],
                "summary": {}
            }

        recommended_sets = recommend_numbers(past_draws, count=10)
        for i, nums in enumerate(recommended_sets):
            results.append({
                "round": f"Bayes {i + 1}",
                "matched": 0,  # 초기엔 적중 미계산
                "strategy": "bayesian",
                "filter": filter_name or "기본값",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "numbers": nums
            })

        save_history(results)
        summary = evaluate_strategy(results)
        return {
            "results": results,
            "summary": summary 
        }

    # 기존 방식 (랜덤 matched)
    for i in range(10):
        match = random.randint(0, 6)
        results.append({
            "round": f"Trial {i+1}",
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


def save_history(rows):
    is_new_file = not os.path.exists(LOG_PATH)
    with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["date", "round", "strategy", "matched", "filter", "numbers"]
        )
        if is_new_file or os.path.getsize(LOG_PATH) == 0:
            writer.writeheader()
        for row in rows:
            writer.writerow({
                "date": row["date"],
                "round": row["round"],
                "strategy": row["strategy"],
                "matched": row["matched"],
                "filter": row.get("filter", "기본값"),
                "numbers": ','.join(map(str, row.get("numbers", [])))  # ✅ 추가!
            })



import os
import csv

def load_history():
    logs = []
    path = "logs/simulation_logs.csv"

    if not os.path.exists(path):
        return logs

    try:
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # ✅ 모든 필드를 문자열로 변환 + None 방지
                clean_row = {k: (str(v) if v is not None else "") for k, v in row.items()}
                logs.append(clean_row)

        # ✅ 안전하게 정렬: date가 존재할 경우만 사용
        logs.sort(key=lambda x: x.get("date") or "")

    except Exception as e:
        print(f"[load_history error]: {e}")
        return []  # 실패 시 빈 리스트 반환

    return logs

def get_stats(from_date, to_date):
    data = load_history()
    filtered = []
    for r in data:
        try:
            if from_date <= r["date"] <= to_date:
                filtered.append(r)
        except KeyError:
            continue

    stat = {}
    for row in filtered:
        key = f"{row['strategy']}+{row.get('filter', '기본값')}"
        matched = int(row["matched"])
        if key not in stat:
            stat[key] = {"total": 0, "count": 0, "max": 0, "min": 6}
        stat[key]["total"] += matched
        stat[key]["count"] += 1
        stat[key]["max"] = max(stat[key]["max"], matched)
        stat[key]["min"] = min(stat[key]["min"], matched)

    summary = []
    for k, v in stat.items():
        avg = v["total"] / v["count"] if v["count"] > 0 else 0
        summary.append({
            "strategy+filter": k,
            "average": avg,
            "max": v["max"],
            "min": v["min"]
        })

    return summary

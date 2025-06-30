# backend/simulate_utils.py
import os
import random
import csv
from datetime import datetime

LOG_PATH = "logs/simulation_logs.csv"

def simulate_strategy(strategy_name, filter_name=None):
    results = []
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
            fieldnames=["date", "round", "strategy", "matched", "filter"]
        )
        if is_new_file or os.path.getsize(LOG_PATH) == 0:
            writer.writeheader()
        for row in rows:
            writer.writerow({
                "date": row["date"],
                "round": row["round"],
                "strategy": row["strategy"],
                "matched": row["matched"],
                "filter": row.get("filter", "기본값")
            })


def load_history():
    records = []
    try:
        with open(LOG_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if "date" in row and "matched" in row and "strategy" in row:
                    records.append(row)
    except FileNotFoundError:
        pass
    return records


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

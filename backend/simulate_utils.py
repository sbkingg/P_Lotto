import random
import csv
from datetime import datetime

LOG_PATH = "logs/simulation_logs.csv"

def simulate_strategy(strategy_name):
    results = []
    for i in range(10):
        match = random.randint(0, 6)
        results.append({
            "round": f"Trial {i+1}",
            "matched": match,
            "strategy": strategy_name,
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
    with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["date", "round", "strategy", "matched"])
        for row in rows:
            writer.writerow({
                "date": row["date"],
                "round": row["round"],
                "strategy": row["strategy"],
                "matched": row["matched"]
            })

def load_history():
    records = []
    try:
        with open(LOG_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append(row)
    except FileNotFoundError:
        pass
    return records

def get_stats(from_date, to_date):
    data = load_history()
    filtered = [r for r in data if from_date <= r["date"] <= to_date]

    stat = {}
    for row in filtered:
        strategy = row["strategy"]
        matched = int(row["matched"])
        if strategy not in stat:
            stat[strategy] = {"total": 0, "count": 0, "max": 0, "min": 6}
        stat[strategy]["total"] += matched
        stat[strategy]["count"] += 1
        stat[strategy]["max"] = max(stat[strategy]["max"], matched)
        stat[strategy]["min"] = min(stat[strategy]["min"], matched)

    summary = []
    for k, v in stat.items():
        avg = v["total"] / v["count"] if v["count"] > 0 else 0
        summary.append({
            "strategy": k,
            "average": avg,
            "max": v["max"],
            "min": v["min"]
        })

    return summary

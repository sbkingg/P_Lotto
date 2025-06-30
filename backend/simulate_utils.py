# simulate_utils.py
import random
import csv
from datetime import datetime

LOG_PATH = "logs/simulation_logs.csv"

def simulate_strategy(strategy_name, filter_name="기본값"):
    results = []
    for i in range(10):
        match = random.randint(0, 6)
        results.append({
            "round": f"Trial {i+1}",
            "matched": match,
            "strategy": strategy_name,
            "filter": filter_name,
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
    try:
        date_format = "%Y-%m-%d"
        from_dt = datetime.strptime(from_date, date_format)
        to_dt = datetime.strptime(to_date, date_format)
    except Exception as e:
        raise ValueError(f"Invalid date format: {e}")

    data = load_history()
    filtered = []
    for r in data:
        try:
            record_date = datetime.strptime(r["date"], "%Y-%m-%d")
            if from_dt <= record_date <= to_dt:
                filtered.append(r)
        except Exception:
            continue  # 날짜 파싱 오류 무시

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
            "average": round(avg, 2),
            "max": v["max"],
            "min": v["min"]
        })

    return summary

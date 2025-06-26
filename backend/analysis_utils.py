from simulate_utils import load_history

def recommend_best_strategy():
    data = load_history()
    stats = {}
    for row in data:
        s = row["strategy"]
        m = int(row["matched"])
        if s not in stats:
            stats[s] = {"total": 0, "count": 0}
        stats[s]["total"] += m
        stats[s]["count"] += 1

    summary = []
    for name, v in stats.items():
        avg = v["total"] / v["count"]
        summary.append((name, avg, v["count"]))

    summary.sort(key=lambda x: (-x[1], -x[2]))  # 평균 → 횟수 기준 정렬
    best = summary[0] if summary else ("none", 0, 0)

    return {
        "recommended_strategy": best[0],
        "average_matched": best[1],
        "total_runs": best[2],
        "ranked_strategies": summary
    }

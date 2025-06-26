# recommend_best.py
import pandas as pd

# backend/recommend_best.py
def recommend_best_strategies():
    return ["proto", "v90", "hybrid_best"]

    try:
        df = pd.read_csv(log_path)
        if df.empty:
            return []
        # 평균 적중률 기준으로 상위 전략 추출
        grouped = df.groupby('전략')['적중수'].mean()
        top_strategies = grouped.sort_values(ascending=False).head(top_n)
        return top_strategies.index.tolist()
    except Exception as e:
        print(f"[Error] 추천 실패: {e}")
        return []

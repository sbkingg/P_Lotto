# backend/app.py

from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
import os
import json

# 외부 전략/유틸 함수 import
from simulate_utils import simulate_strategy, load_history, get_stats
from strategy_module import get_filters, recommend_best

app = Flask(__name__)
CORS(app)

# logs 디렉토리 생성 보장
os.makedirs("logs", exist_ok=True)

# --------------------------
# [1] 전략 필터 목록 제공
# --------------------------
@app.route("/api/recommend-filters", methods=["GET"])
def recommend_filters():
    try:
        filters = get_filters()
        # 한글 깨짐 방지를 위해 Response 사용 + ensure_ascii=False
        return Response(json.dumps({"filters": filters}, ensure_ascii=False), mimetype='application/json')
    except Exception as e:
        print(f"[ERROR] /recommend-filters: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [2] 전략 시뮬레이션 실행
# --------------------------
@app.route("/api/simulate", methods=["POST"])
def run_simulation():
    try:
        data = request.get_json()
        strategy = data.get("strategy")
        if not strategy:
            return jsonify({"error": "Strategy name is required"}), 400

        result = simulate_strategy(strategy)
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] /simulate: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [3] 전략별 추천 리스트
# --------------------------
@app.route("/api/recommend-best", methods=["GET"])
def get_recommend_best():
    try:
        result = recommend_best()
        return jsonify({"best_strategies": result})
    except Exception as e:
        print(f"[ERROR] /recommend-best: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [4] 로그 기록 전체 조회
# --------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        rows = load_history()
        return jsonify({"logs": rows})
    except Exception as e:
        print(f"[ERROR] /history: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [5] 전략별 통계 요약
# --------------------------
@app.route("/api/stats", methods=["GET"])
def get_stats_summary():
    try:
        from_date = request.args.get("from")
        to_date = request.args.get("to")
        result = get_stats(from_date, to_date)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] /stats: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [6] CSV 로그 파일 다운로드
# --------------------------
@app.route("/logs/<path:filename>")
def download_file(filename):
    return send_from_directory("logs", filename)

# --------------------------
# [7] 테스트 라우트
# --------------------------
@app.route("/test")
def test():
    return "Flask is running!"

# --------------------------
# [MAIN]
# --------------------------
if __name__ == "__main__":
    app.run(debug=True)

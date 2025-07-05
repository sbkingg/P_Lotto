# backend/app.py

from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
import os
import json
from datetime import datetime

from simulate_utils import simulate_strategy, load_history, get_stats
from strategy_module import simulate as simulate_strategy
from strategy_module import get_filters, recommend_best

app = Flask(__name__)
CORS(app)

# logs 디렉토리 보장
os.makedirs("logs", exist_ok=True)

# --------------------------
# [1] 필터 목록 제공
# --------------------------
@app.route("/api/recommend-filters", methods=["GET"])
def recommend_filters():
    try:
        filters = get_filters()
        return Response(
            json.dumps({"filters": filters}, ensure_ascii=False),
            mimetype="application/json"
        )
    except Exception as e:
        print(f"[ERROR] /recommend-filters: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [2] 전략 시뮬레이션
# --------------------------
@app.route("/api/simulate", methods=["POST"])
def run_simulation():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid or missing JSON data."}), 400

        strategy = data.get("strategy")
        filter_name = data.get("filter") or "기본값"

        if not strategy:
            return jsonify({"error": "Strategy name is required"}), 400

        result = simulate_strategy(strategy, filter_name)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] /simulate: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [3] 추천 전략
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
# [4] 로그 전체 조회
# --------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        logs = load_history()
        return jsonify({"logs": logs})
    except Exception as e:
        print(f"[ERROR] /history: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [5] 전략별 통계 요약
# --------------------------
@app.route("/api/stats", methods=["GET"])
def get_stats_summary():
    try:
        from_date_str = request.args.get("from")
        to_date_str = request.args.get("to")
        min_matched = request.args.get("minMatched")

        if not from_date_str or not to_date_str:
            return jsonify({"error": "Both 'from' and 'to' parameters are required."}), 400

        # 🔧 날짜 파싱
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
        
        # 🔧 minMatched 숫자 처리
        try:
            min_matched = int(min_matched) if min_matched is not None else 0
        except (ValueError, TypeError):
            min_matched = 0

        result = get_stats(from_date, to_date, min_matched)
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] /stats: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------
# [6] CSV 파일 다운로드
# --------------------------
@app.route("/logs/<path:filename>")
def download_file(filename):
    return send_from_directory("logs", filename)

# --------------------------
# [7] 서버 상태 확인용
# --------------------------
@app.route("/test", methods=["GET"])
def test():
    return "✅ Flask 서버 정상 작동 중!"

# --------------------------
# [MAIN]
# --------------------------
if __name__ == "__main__":
    app.run(debug=True)

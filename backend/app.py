from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from strategy_module import recommend_filters
from simulate_utils import simulate_strategy, load_history, get_stats
from analysis_utils import recommend_best_strategy
import os

app = Flask(__name__)
CORS(app)

@app.route("/api/recommend-filters", methods=["GET"])
def get_filters():
    try:
        filters = recommend_filters()
        return jsonify(filters)
    except Exception as e:
        print("[ERROR] recommend_filters:", e)
        return jsonify({"error": "Failed to load filters"}), 400

@app.route("/api/simulate", methods=["POST"])
def run_simulation():
    data = request.get_json()
    strategy = data.get("strategy")

    if not strategy:
        return jsonify({"error": "Strategy name is required"}), 400

    try:
        results = simulate_strategy(strategy)
        return jsonify(results)
    except Exception as e:
        print("[ERROR] simulate_strategy:", e)
        return jsonify({"error": "Simulation failed"}), 500

@app.route("/api/history", methods=["GET"])
def history():
    try:
        rows = load_history()
        return jsonify(rows)
    except Exception as e:
        print("[ERROR] load_history:", e)
        return jsonify({"error": "Failed to load history"}), 500

@app.route("/api/stats", methods=["GET"])
def stats():
    try:
        from_date = request.args.get("from")
        to_date = request.args.get("to")
        if not from_date or not to_date:
            return jsonify({"error": "Date range required"}), 400

        summary = get_stats(from_date, to_date)
        return jsonify(summary)
    except Exception as e:
        print("[ERROR] get_stats:", e)
        return jsonify({"error": "Failed to calculate stats"}), 500

@app.route("/api/recommend-best", methods=["GET"])
def recommend_best():
    try:
        result = recommend_best_strategy()
        return jsonify(result)
    except Exception as e:
        print("[ERROR] recommend_best_strategy:", e)
        return jsonify({"error": "Recommendation failed"}), 500

@app.route("/logs/<path:filename>")
def download_file(filename):
    return send_from_directory("logs", filename)

if __name__ == "__main__":
    os.makedirs("logs", exist_ok=True)
    app.run(debug=True)

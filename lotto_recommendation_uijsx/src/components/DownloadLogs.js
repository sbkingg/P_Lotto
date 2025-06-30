// src/components/DownloadLogs.js
import React from "react";
import { saveAs } from "file-saver";

function DownloadLogs({ data = [] }) {
  const handleDownload = () => {
    if (!data.length) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row =>
      Object.values(row).map(val => `"${val}"`).join(",")
    ).join("\n");

    const csv = [headers, rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "filtered_simulation_logs.csv");
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleDownload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        📄 필터링된 CSV 다운로드
      </button>
    </div>
  );
}

export default DownloadLogs;

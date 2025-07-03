// 🔵 DownloadButton.jsx (CSV 다운로드용)
import React from "react";
import axios from "axios";

const DownloadButton = () => {
  const handleDownload = () => {
    axios
      .get("/api/download", { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "lotto_report.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => console.error("CSV 다운로드 실패", err));
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        CSV 다운로드
      </button>
    </div>
  );
};

export default DownloadButton;

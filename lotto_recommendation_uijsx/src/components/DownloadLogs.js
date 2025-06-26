import React from "react";

function DownloadLogs() {
  const handleDownload = () => {
    window.open("/logs/simulation_logs.csv", "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded ml-2"
    >
      CSV 다운로드
    </button>
  );
}

export default DownloadLogs;

// frontend/src/components/ReportExporter.js

import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';  // ✅ 이 라인 추가

function ReportExporter({ strategies = [], logs = [] }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('📄 전략 시뮬레이션 리포트', 20, 20);

    // 추천 전략 요약
    if (strategies.length > 0) {
      const best = strategies.reduce((prev, current) =>
        current.evaluation.score > prev.evaluation.score ? current : prev
      );

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 200);
      doc.text(`✅ 추천 전략: ${best.name}`, 20, 35);
      doc.setTextColor(0, 0, 0);
      doc.text(`- 평균 적중: ${best.evaluation.average}`, 20, 45);
      doc.text(`- 최대 적중: ${best.evaluation.max}`, 20, 53);
      doc.text(`- 최소 적중: ${best.evaluation.min}`, 20, 61);
      doc.text(`- 표준편차: ${best.evaluation.stddev}`, 20, 69);
      doc.text(`- 안정성: ${best.evaluation.stability}`, 20, 77);
      doc.text(`- 종합 점수: ${best.evaluation.score}`, 20, 85);
    }

    // 로그 요약
    doc.setFontSize(14);
    doc.text('📑 시뮬레이션 로그 요약', 20, 100);
    doc.setFontSize(10);
    const maxLines = 20;
    autoTable(doc, {
      startY: 100,
      head: [["#", "전략명", "번호", "점수", "필터"]],
      body: strategies.map((s, i) => [
        i + 1,
        s.name || `전략-${i + 1}`,
        Array.isArray(s.numbers) ? s.numbers.join(" ") : "-",
        s.score ?? "-",
        s.filter || "-"
      ]),
      styles: { fontSize: 9 }
    });


    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    doc.save(`report_${today}.pdf`);

  };

  return (
    <div className="mt-6">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        📥 전략 리포트 다운로드
      </button>
    </div>
  );
}

export default ReportExporter;

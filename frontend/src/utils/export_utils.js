import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ 핵심 포인트!

export function downloadCSV(strategies, filename = "strategies.csv") {
  const headers = ["이름", "번호", "점수"];
  const rows = strategies.map((s) => [
    s.name || "이름없음",
    (s.numbers || []).join(" "),
    s.score ?? "-"
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadStrategiesAsPDF(strategies, filename = "strategies.pdf") {
  const doc = new jsPDF();

  const tableData = strategies.map((s, idx) => [
    idx + 1,
    s.name || `전략-${idx + 1}`,
    Array.isArray(s.numbers) ? s.numbers.join(" ") : (typeof s.numbers === "string" ? s.numbers : "-"),
    s.score ?? "-"
  ]);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(14);
  doc.text("전략 리포트", 14, 20);

  autoTable(doc, {
    head: [["#", "전략명", "번호", "점수"]],
    body: tableData,
    startY: 30,
    styles: { fontSize: 10 }
  });

  doc.save(filename);
}

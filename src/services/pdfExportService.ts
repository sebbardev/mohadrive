import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense, ExpenseDashboard } from "./expenseService";
import { Stats, CarProfitDetail } from "./statsService";

// MohaDrive brand colors
const COLORS: { [key: string]: [number, number, number] } = {
  primary: [6, 102, 140], // #06668C
  secondary: [103, 148, 54], // #679436
  accent: [164, 189, 1], // #A4BD01
  highlight: [239, 202, 67], // #EFCA43
  text: [14, 44, 66], // #0E2C42
  white: [255, 255, 255],
  gray: [128, 128, 128],
  lightGray: [240, 240, 240],
  red: [239, 68, 68],
  green: [34, 197, 94],
  blue: [59, 130, 246],
};

interface PeriodSelection {
  from: string;
  to: string;
  label: string;
}

export function getPeriodOptions(): PeriodSelection[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return [
    {
      label: "Ce mois",
      from: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    },
    {
      label: "Mois dernier",
      from: new Date(currentYear, currentMonth - 1, 1).toISOString().split("T")[0],
      to: new Date(currentYear, currentMonth, 0).toISOString().split("T")[0],
    },
    {
      label: "Ce trimestre",
      from: new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1).toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    },
    {
      label: "Cette année",
      from: new Date(currentYear, 0, 1).toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    },
    {
      label: "Tout l'historique",
      from: "",
      to: "",
    },
  ];
}

// Helper to add styled header
function addHeader(doc: jsPDF, title: string, periodLabel: string, from?: string, to?: string): number {
  const pageWidth = doc.internal.pageSize.width;
  
  // Background gradient-like effect (solid color for PDF)
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(10, 10, pageWidth - 20, 40, 5, 5, "F");
  
  // Title
  doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), 20, 38);
  
  // Period info
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let periodText = `Période: ${periodLabel}`;
  if (from && to) {
    periodText += ` (${formatDateFr(from)} - ${formatDateFr(to)})`;
  }
  doc.text(periodText, pageWidth - 20, 38, { align: "right" });
  
  // Generation date
  doc.setFontSize(8);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - 20, 22, { align: "right" });
  
  return 60; // Return Y position after header
}

function formatDateFr(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} DH`;
}

// Add KPI card section
function addKPICards(
  doc: jsPDF,
  startY: number,
  cards: Array<{ label: string; value: string; color?: number[] }>
): number {
  const pageWidth = doc.internal.pageSize.width;
  const cardWidth = (pageWidth - 40) / 4;
  const cardHeight = 45;
  let currentX = 15;

  cards.forEach((card, index) => {
    const color = card.color || COLORS.primary;
    
    // Card background
    doc.setFillColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setDrawColor(COLORS.lightGray[0], COLORS.lightGray[1], COLORS.lightGray[2]);
    doc.roundedRect(currentX, startY, cardWidth - 5, cardHeight, 4, 4, "FD");
    
    // Colored top bar
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(currentX, startY, cardWidth - 5, 4, 2, 2, "F");
    
    // Label
    doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(card.label.toUpperCase(), currentX + 8, startY + 15);
    
    // Value
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, currentX + 8, startY + 32);
    
    currentX += cardWidth;
  });

  return startY + cardHeight + 15;
}

// Export Expenses to PDF
export async function exportExpensesToPDF(
  expenses: Expense[],
  dashboard: ExpenseDashboard | null,
  period: PeriodSelection
): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  
  let y = addHeader(doc, "Liste des Charges", period.label, period.from || undefined, period.to || undefined);
  
  // Section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DÉTAIL DES CHARGES", 15, y);
  
  doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
  doc.setFontSize(9);
  doc.text(`${expenses.length} charge(s) enregistrée(s)`, pageWidth - 15, y, { align: "right" });
  y += 10;
  
  // Table
  const tableData = expenses.map((exp) => [
    `${exp.car?.brand || ""} ${exp.car?.model || ""}`,
    exp.type.toUpperCase(),
    `-${formatCurrency(exp.amount)}`,
    formatDateFr(exp.date),
    exp.note || "—",
  ]);
  
  autoTable(doc, {
    startY: y,
    head: [["Véhicule", "Type", "Montant", "Date", "Note"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: "bold" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 35, halign: "right", textColor: COLORS.red },
      3: { cellWidth: 30, halign: "center" },
      4: { cellWidth: "auto" },
    },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.5,
    },
    margin: { left: 15, right: 15 },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
    doc.text(
      `Page ${i} / ${pageCount} - MohaDrive`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  doc.save(`mohadrive-charges-${new Date().toISOString().split("T")[0]}.pdf`);
}

// Export Stats to PDF
export async function exportStatsToPDF(
  stats: Stats,
  period: PeriodSelection
): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  
  let y = addHeader(doc, "Rapport Statistiques", period.label, period.from || undefined, period.to || undefined);
  
  // KPI Cards
  y = addKPICards(doc, y, [
    { label: "Chiffre d'affaires", value: formatCurrency(stats.totalRevenue), color: COLORS.green },
    { label: "Charges totales", value: formatCurrency(stats.totalExpenses), color: COLORS.red },
    { label: "Bénéfice net", value: formatCurrency(stats.netGain), color: stats.netGain >= 0 ? COLORS.primary : COLORS.red },
    { label: "Taux d'occupation", value: `${Math.round((stats.activeBookings / (stats.totalCars || 1)) * 100)}%`, color: COLORS.blue },
  ]);
  
  // Performance Mensuelle Section
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PERFORMANCE MENSUELLE", 15, y);
  y += 10;
  
  // Monthly data table
  if (stats.monthlyData && stats.monthlyData.length > 0) {
    const monthlyTableData = stats.monthlyData.map((m) => [
      m.name,
      formatCurrency(m.revenue),
      formatCurrency(m.expenses),
      formatCurrency(m.profit),
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [["Mois", "Revenus", "Charges", "Profit"]],
      body: monthlyTableData,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.text,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: 45, halign: "right", textColor: COLORS.green },
        2: { cellWidth: 45, halign: "right", textColor: COLORS.red },
        3: { 
          cellWidth: 45, 
          halign: "right",
          fontStyle: "bold",
        },
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      margin: { left: 15, right: 15 },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 3) {
          const value = parseFloat(data.cell.raw.replace(/[^\d.-]/g, ""));
          data.cell.styles.textColor = value >= 0 ? COLORS.green : COLORS.red;
        }
      },
    });
    
    // @ts-ignore - lastAutoTable is added by jspdf-autotable
    y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 15 : y + 20;
  }
  
  // Expense breakdown section (new page if needed)
  if (y > 200) {
    doc.addPage();
    y = 20;
  }
  
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RÉPARTITION DES CHARGES", 15, y);
  y += 10;
  
  // Expense type data
  if (stats.expenseTypeStats && stats.expenseTypeStats.length > 0) {
    const expenseData = stats.expenseTypeStats.map((e) => [
      e.type.toUpperCase(),
      formatCurrency(e.amount),
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [["Type de charge", "Montant"]],
      body: expenseData,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.secondary,
        textColor: COLORS.white,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.text,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold" },
        1: { cellWidth: 60, halign: "right", textColor: COLORS.red },
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      margin: { left: 15, right: 15 },
    });
    
    // @ts-ignore - lastAutoTable is added by jspdf-autotable
    y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 15 : y + 20;
  }
  
  // Top Rentability (new page if needed)
  if (y > 180 && stats.carsProfit.length > 0) {
    doc.addPage();
    y = 20;
  } else {
    y += 10;
  }
  
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOP RENTABILITÉ", 15, y);
  y += 10;
  
  if (stats.carsProfit && stats.carsProfit.length > 0) {
    const profitData = stats.carsProfit.slice(0, 10).map((car, index) => [
      `${index + 1}`,
      `${car.brand} ${car.model}`,
      formatCurrency(car.total_revenue),
      formatCurrency(car.total_expenses),
      formatCurrency(car.profit),
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [["#", "Véhicule", "Revenus", "Charges", "Gain Net"]],
      body: profitData,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.accent,
        textColor: COLORS.text,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.text,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
        1: { cellWidth: 50, fontStyle: "bold" },
        2: { cellWidth: 40, halign: "right", textColor: COLORS.green },
        3: { cellWidth: 40, halign: "right", textColor: COLORS.red },
        4: { 
          cellWidth: 40, 
          halign: "right",
          fontStyle: "bold",
        },
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      margin: { left: 15, right: 15 },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 0) {
          const rank = parseInt(data.cell.raw);
          if (rank === 1) {
            data.cell.styles.fillColor = [255, 215, 0]; // Gold
          } else if (rank === 2) {
            data.cell.styles.fillColor = [192, 192, 192]; // Silver
          } else if (rank === 3) {
            data.cell.styles.fillColor = [205, 127, 50]; // Bronze
          }
        }
        if (data.section === "body" && data.column.index === 4) {
          const value = parseFloat(data.cell.raw.replace(/[^\d.-]/g, ""));
          data.cell.styles.textColor = value >= 0 ? COLORS.green : COLORS.red;
        }
      },
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
    doc.text(
      `Page ${i} / ${pageCount} - MohaDrive`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  doc.save(`mohadrive-statistiques-${new Date().toISOString().split("T")[0]}.pdf`);
}

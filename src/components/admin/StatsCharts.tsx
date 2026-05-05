"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatsChartsProps {
  type: "line" | "bar" | "pie";
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    stack?: string;
  }>;
  stacked?: boolean;
  showProfitLine?: boolean;
  profitLineValue?: number;
}

export default function StatsCharts({ 
  type, 
  labels, 
  datasets, 
  stacked = false,
  showProfitLine = false,
  profitLineValue = 0 
}: StatsChartsProps) {
  if (!labels || labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Pas assez de données pour générer le graphique.
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#9ca3af",
          font: { weight: "bold" as const, size: 10 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#9ca3af",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: type !== "pie" ? {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 10 } },
        stacked: stacked,
      },
      y: {
        grid: { color: "rgba(75, 85, 99, 0.1)" },
        ticks: { color: "#6b7280", font: { size: 10 } },
        stacked: stacked,
      },
    } : undefined,
  };

  // Platform colors from globals.css
  const platformColors = {
    primary: '#06668C',      // Navy Blue - Main Brand Color
    secondary: '#427AA1',    // Medium Blue - Accents
    accent: '#679436',       // Forest Green - Buttons/CTA
    highlight: '#A4BD01',    // Lime Green - Highlights
  };

  const finalDatasets = datasets.map(ds => ({
    ...ds,
    backgroundColor: ds.backgroundColor || (type === "pie" 
      ? [platformColors.primary, platformColors.secondary, platformColors.accent, platformColors.highlight, "#F59E0B", "#F43F5E"] 
      : `${platformColors.primary}33`), // 20% opacity of primary
    borderColor: ds.borderColor || platformColors.primary,
    borderWidth: ds.borderWidth || 2,
    fill: ds.fill ?? true,
    tension: ds.tension ?? 0.4,
  }));

  if (showProfitLine && type === "bar") {
    finalDatasets.push({
      type: 'line' as any,
      label: 'Objectif Rentabilité',
      data: labels.map(() => profitLineValue),
      borderColor: '#A4BD01',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0,
      tension: 0,
    } as any);
  }

  const chartData = {
    labels,
    datasets: finalDatasets,
  };

  return (
    <div className="h-[300px] w-full">
      {type === "line" && <Line data={chartData} options={options} />}
      {type === "bar" && <Bar data={chartData} options={options} />}
      {type === "pie" && <Pie data={chartData} options={options} />}
    </div>
  );
}

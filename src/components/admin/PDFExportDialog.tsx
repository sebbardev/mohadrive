"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Calendar, Download, Loader2 } from "lucide-react";
import { getPeriodOptions } from "@/services/pdfExportService";

interface PDFExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (from: string, to: string) => Promise<void>;
  title: string;
  description?: string;
}

export default function PDFExportDialog({
  isOpen,
  onClose,
  onExport,
  title,
  description = "Sélectionnez la période des données à exporter",
}: PDFExportDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");

  const periodOptions = getPeriodOptions();

  const handleExport = async () => {
    let from = "";
    let to = "";

    if (activeTab === "preset" && selectedPeriod) {
      const period = periodOptions.find((p) => p.label === selectedPeriod);
      if (period) {
        from = period.from;
        to = period.to;
      }
    } else if (activeTab === "custom") {
      from = customFrom;
      to = customTo;
    }

    setIsExporting(true);
    try {
      await onExport(from, to);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const isValid =
    (activeTab === "preset" && selectedPeriod) ||
    (activeTab === "custom" && customFrom && customTo);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!isExporting ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-white/70 font-medium">
                    {description}
                  </p>
                </div>
              </div>

              {!isExporting && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setActiveTab("preset")}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === "preset"
                      ? "bg-white text-[var(--color-primary)] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Périodes prédéfinies
                </button>
                <button
                  onClick={() => setActiveTab("custom")}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === "custom"
                      ? "bg-white text-[var(--color-primary)] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Personnalisé
                </button>
              </div>

              {/* Preset Periods */}
              {activeTab === "preset" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-2"
                >
                  {periodOptions.map((period) => (
                    <button
                      key={period.label}
                      onClick={() => setSelectedPeriod(period.label)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPeriod === period.label
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedPeriod === period.label
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Calendar size={18} />
                        </div>
                        <span
                          className={`font-bold ${
                            selectedPeriod === period.label
                              ? "text-[var(--color-primary)]"
                              : "text-gray-700"
                          }`}
                        >
                          {period.label}
                        </span>
                      </div>
                      {period.from && period.to && (
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(period.from).toLocaleDateString("fr-FR")} →{" "}
                          {new Date(period.to).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {selectedPeriod === period.label && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Custom Period */}
              {activeTab === "custom" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                        Date début
                      </label>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                        Date fin
                      </label>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isExporting}
                  className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExport}
                  disabled={!isValid || isExporting}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    isValid && !isExporting
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/25"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Exporter PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

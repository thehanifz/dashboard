import { useState, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { useTaskStore } from "../../state/taskStore";
import { useAppearanceStore } from "../../state/appearanceStore";

import KanbanColumn from "./KanbanColumn";
import GlobalLabelManager from "./GlobalLabelManager";
import CardFieldManager from "./CardFieldManager";
import ColumnVisibilityManager from "./ColumnVisibilityManager";
import FilterManager from "./FilterManager";

export default function KanbanBoard() {
  const records = useTaskStore((s) => s.records);
  const statusMaster = useTaskStore((s) => s.statusMaster);
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const hiddenStatuses = useAppearanceStore((s) => s.hiddenStatuses);
  
  // Ambil state ukuran & filter
  const { 
    activeFilters, 
    columnWidth, 
    setColumnWidth 
  } = useAppearanceStore();
  
  // -- UI State (Modals) --
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [showColManager, setShowColManager] = useState(false);
  const [showFilterManager, setShowFilterManager] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);

  // -- Data Manipulation State --
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id_asc" | "id_desc" | "newest" | "oldest">("id_asc");

  // === PERBAIKAN DI SINI ===
  // JANGAN return null di sini. Biarkan Hooks di bawah jalan dulu.
  // if (!statusMaster) return null; <--- INI BIANG KEROKNYA (HAPUS/PINDAH)

  // 1. FILTER KOLOM (Gunakan Optional Chaining '?.')
  const visibleStatuses = useMemo(() => {
    // Jika statusMaster null atau primary tidak ada, kembalikan array kosong agar tidak error
    if (!statusMaster || !statusMaster.primary) return [];
    return statusMaster.primary.filter(s => !hiddenStatuses.includes(s));
  }, [statusMaster, hiddenStatuses]);

  // 2. GET STATUS COLUMN NAME
  const statusColumnName = useMemo(() => {
    if (!statusMaster) return "StatusPekerjaan"; // fallback to default
    return statusMaster.status_column || "StatusPekerjaan";
  }, [statusMaster]);

  // 2. SEARCH + FILTER + SORT PIPELINE
  const processedRecords = useMemo(() => {
    let result = [...records];

    // Filter
    if (Object.keys(activeFilters).length > 0) {
        result = result.filter((r) => {
            return Object.entries(activeFilters).every(([key, validValues]) => {
                const recordValue = String(r.data[key] || "");
                return validValues.includes(recordValue);
            });
        });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const allText = Object.values(r.data).join(" ").toLowerCase();
        const idText = String(r.row_id);
        return allText.includes(q) || idText.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      const idA = a.data["ID PA"] || "";
      const idB = b.data["ID PA"] || "";
      
      switch (sortBy) {
        case "id_asc": return idA.localeCompare(idB);
        case "id_desc": return idB.localeCompare(idA);
        case "newest": return b.row_id - a.row_id;
        case "oldest": return a.row_id - b.row_id;
        default: return 0;
      }
    });

    return result;
  }, [records, searchQuery, sortBy, activeFilters]);

  const activeFilterCount = Object.keys(activeFilters).length;

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const rowId = active.data.current?.row_id;
    const nextStatus = over.id;
    if (!rowId || !nextStatus) return;
    updateStatus(rowId, nextStatus, undefined);
  };

  // === BARU DI SINI ===
  // Setelah semua hooks didefinisikan, baru kita cek datanya.
  // Jika data belum siap, return null atau Loading spinner.
  if (!statusMaster) return <div className="p-4 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* === TOOLBAR AREA === */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 mb-2 shadow-sm space-y-3">
        
        {/* Baris 1: Search, Filter, Sort */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* SEARCH */}
            <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                 {/* FILTER */}
                 <button
                    onClick={() => setShowFilterManager(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                        activeFilterCount > 0 
                            ? "bg-blue-50 border-blue-200 text-blue-700" 
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* SORT */}
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="block pl-2 pr-8 py-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-blue-500 sm:text-sm rounded"
                >
                    <option value="id_asc">ID (A-Z)</option>
                    <option value="id_desc">ID (Z-A)</option>
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                </select>
            </div>
        </div>

        {/* Baris 2: View Control & Size Slider */}
        <div className="flex flex-wrap justify-between items-center pt-2 border-t border-gray-100 gap-2">
            
            {/* Kiri: Slider Ukuran */}
            <div className="relative group">
                <button
                    onClick={() => setShowSizeSlider(!showSizeSlider)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Ukuran Kolom: <b>{columnWidth || 320}px</b>
                </button>

                {/* Dropdown Slider */}
                {showSizeSlider && (
                    <>
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowSizeSlider(false)} />
                    <div className="absolute top-8 left-0 z-20 bg-white border border-gray-200 shadow-xl rounded p-4 w-64 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-500">Ramping (250px)</span>
                            <span className="text-xs text-gray-500">Lebar (500px)</span>
                        </div>
                        <input
                            type="range"
                            min="250"
                            max="500"
                            step="10"
                            value={columnWidth || 320}
                            onChange={(e) => setColumnWidth(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    </>
                )}
            </div>

            {/* Kanan: Tombol-tombol Manager */}
            <div className="flex gap-2">
                <button
                onClick={() => setShowColManager(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded hover:bg-white hover:text-blue-600 transition-all"
                >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Kolom Status
                </button>

                <button
                onClick={() => setShowFieldManager(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded hover:bg-white hover:text-blue-600 transition-all"
                >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Isi Kartu
                </button>

                <button
                onClick={() => setShowLabelManager(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded hover:bg-white hover:text-blue-600 transition-all"
                >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Warna Label
                </button>
            </div>
        </div>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-auto pb-4 px-4">
          {/* RENDER VISIBLE COLUMNS */}
          {visibleStatuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              records={processedRecords.filter(
                (r) => r.data[statusColumnName] === status
              )}
            />
          ))}
        </div>
      </DndContext>

      {/* Modals */}
      {showLabelManager && <GlobalLabelManager onClose={() => setShowLabelManager(false)} />}
      {showFieldManager && <CardFieldManager onClose={() => setShowFieldManager(false)} />}
      {showColManager && <ColumnVisibilityManager onClose={() => setShowColManager(false)} />}
      {showFilterManager && <FilterManager onClose={() => setShowFilterManager(false)} />}
    </div>
  );
}
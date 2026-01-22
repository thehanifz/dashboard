import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { useAppearanceStore } from "../../state/appearanceStore";
import { getColorTheme } from "../../utils/colorPalette";
import ColorPicker from "../ui/ColorPicker";

type KanbanRecord = {
  row_id: number;
  data: Record<string, string>;
};

type Props = {
  status: string;
  records: KanbanRecord[];
};

export default function KanbanColumn({ status, records }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [showPicker, setShowPicker] = useState(false);

  // Ambil warna DAN lebar kolom dari store
    // Tambahkan fallback (|| 320) agar kalau data kosong, dia tidak error
  const state = useAppearanceStore();
  const columnColors = state.columnColors;
  const setColumnColor = state.setColumnColor;
  const columnWidth = state.columnWidth || 320; // <--- INI KUNCINYA
  
  const themeId = columnColors[status] || "gray";
  const theme = getColorTheme(themeId);

  return (
    <div
      ref={setNodeRef}
      // REVISI: Hapus 'w-80'. Gunakan style dinamis untuk lebar.
      className={`rounded-lg p-3 border transition-all duration-300 relative flex flex-col shrink-0 ${
        theme.border
      } ${theme.bg} ${isOver ? "ring-2 ring-offset-2 ring-blue-300" : ""}`}
      style={{ 
        maxHeight: "calc(100vh - 140px)",
        width: `${columnWidth}px`,      // Lebar Dinamis
        minWidth: `${columnWidth}px`    // Mencegah penyusutan
      }} 
    >
      {/* HEADER STICKY */}
      <div 
        className={`flex items-center justify-between mb-2 sticky top-0 z-10 -m-3 p-3 rounded-t-lg border-b border-transparent hover:border-black/5 transition-colors ${theme.bg} bg-opacity-95 backdrop-blur-sm group shrink-0`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
            <h3 className={`font-bold truncate ${theme.text}`}>{status}</h3>
            
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded shrink-0"
                title="Ubah Warna Kolom"
            >
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" />
                </svg>
            </button>
        </div>

        <span className="text-xs text-gray-500 font-mono bg-white/50 px-2 py-0.5 rounded-full shrink-0">
          {records.length}
        </span>

        {showPicker && (
          <ColorPicker 
            selectedColorId={themeId}
            onSelect={(colorId) => setColumnColor(status, colorId)}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>

      {/* AREA KARTU */}
      <div className="flex flex-col gap-2 min-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
        {records.map((r) => (
          <TaskCard key={r.row_id} record={r} />
        ))}
      </div>
    </div>
  );
}
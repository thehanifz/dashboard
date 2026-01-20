import { useState, useMemo } from "react";
import { useTaskStore } from "../../state/taskStore";
import { usePresetStore } from "../../state/presetStore";

import { TableHeader } from "./TableHeader";
import { TableFooter } from "./TableFooter";
import { renderCell } from "./renderCell";
import { useTablePagination } from "./useTablePagination";
import { useTableResize } from "./useTableResize";

import PresetEditorDrawer from "../preset/PresetEditorDrawer";
import { statusRowColor } from "../../utils/statusRowColor";

type TablePreset = {
  id: string;
  name: string;
  columns: string[];
  widths?: Record<string, number>;
};

const MIN_COL_WIDTH = 80;
const DEFAULT_COL_WIDTH = 160;

export default function DynamicTable() {
  /* ===== STORE ===== */
  const records = useTaskStore((s) => s.records) ?? [];
  const presets = usePresetStore((s) => s.presets) ?? [];
  const activePresetId = usePresetStore((s) => s.activePresetId);
  const setActivePreset = usePresetStore((s) => s.setActivePreset);
  const addPreset = usePresetStore((s) => s.addPreset);

  const activePreset = presets.find((p) => p.id === activePresetId);

  /* ===== UI STATE ===== */
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  /* ===== FILTER ===== */
  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      Object.values(r.data ?? {}).some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [records, search]);

  /* ===== PAGINATION ===== */
  const pagination = useTablePagination(filteredRecords);

  /* ===== RESIZE (SAFE) ===== */
  const columns = activePreset?.columns ?? [];
  const widths = activePreset?.widths ?? {};
  const resize = useTableResize(activePreset?.id, widths);

  // Get all available columns from task store to use as default when creating a new preset
  const allColumns = useTaskStore((s) => s.columns) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">

      {/* ================= HEADER (SELALU ADA) ================= */}
        <TableHeader
          search={search}
          onSearchChange={setSearch}
          hasActivePreset={!!activePreset}
          onAddPreset={() => {
            // Create a new preset with no columns selected by default
            addPreset("Preset Baru", []);
            setShowEditor(true); // auto buka editor
          }}
          onOpenEditor={() => setShowEditor(true)}
          presets={presets}
          activePresetId={activePresetId}
          onSelectPreset={setActivePreset}
        />



      {/* ================= BODY ================= */}
        {!activePreset ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            Belum ada preset. Klik <b>+ Preset</b> untuk membuat.
        </div>
        ) : (

        <>
          {/* TABLE */}
          <div className="flex-1 overflow-auto border rounded-lg bg-white">
            <table
              className="min-w-max text-xs border-collapse"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      style={{
                        width: widths[col] ?? DEFAULT_COL_WIDTH,
                        minWidth: MIN_COL_WIDTH,
                      }}
                      className="relative px-3 py-2 text-left font-semibold border-b select-none"
                    >
                      <span className="truncate">{col}</span>
                      <span
                        onMouseDown={(e) =>
                          resize.onMouseDown(e, col)
                        }
                        className="absolute top-0 right-0 w-3 h-full cursor-col-resize hover:bg-blue-300/30"
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pagination.rows.map((r) => (
                  <tr
                    key={r.row_id}
                    className={`${statusRowColor(
                      r.data?.StatusPekerjaan
                    )} hover:bg-gray-100`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col}
                        style={{
                          width: widths[col] ?? DEFAULT_COL_WIDTH,
                          minWidth: MIN_COL_WIDTH,
                        }}
                        className="px-3 py-2 border-b whitespace-nowrap"
                      >
                        {renderCell(r, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <TableFooter {...pagination} />
        </>
      )}


      {showEditor && activePreset && (
        <PresetEditorDrawer
          presetId={activePreset.id}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

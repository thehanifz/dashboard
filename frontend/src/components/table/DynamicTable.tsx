import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import { useTaskStore } from "../../state/taskStore";
import { usePresetStore } from "../../state/presetStore";
import { useAppearanceStore } from "../../state/appearanceStore";
import { getColorTheme } from "../../utils/colorPalette";

import { TableHeader } from "./TableHeader";
import { TableFooter } from "./TableFooter";
import { renderCell } from "./renderCell";
import { useTablePagination } from "./useTablePagination";
import { useTableResize } from "./useTableResize";
import { TableHeaderCell } from "./TableHeaderCell";

import PresetEditorModal from "../preset/PresetEditorModal";
import ColumnFilter from "./ColumnFilter";
import EditableColumnsModal from "./EditableColumnsModal";

const MIN_COL_WIDTH = 60; 
const DEFAULT_COL_WIDTH = 150;

export default function DynamicTable() {
  const records = useTaskStore((s) => s.records) ?? [];
  const presets = usePresetStore((s) => s.presets) ?? [];
  const activePresetId = usePresetStore((s) => s.activePresetId);
  const setActivePreset = usePresetStore((s) => s.setActivePreset);
  const addPreset = usePresetStore((s) => s.addPreset);
  const reorderColumns = usePresetStore((s) => s.reorderColumns);
  
  const { columnColors, labelColors, activeFilters } = useAppearanceStore();
  const activePreset = presets.find((p) => p.id === activePresetId);

  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showEditableColumns, setShowEditableColumns] = useState(false);
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState({ top: 0, left: 0 });

  const filteredRecords = useMemo(() => {
    let result = [...records];
    if (Object.keys(activeFilters).length > 0) {
        result = result.filter((r) => {
            return Object.entries(activeFilters).every(([key, validValues]) => {
                const recordValue = String(r.data[key] || "");
                return validValues.includes(recordValue);
            });
        });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        Object.values(r.data ?? {}).some((v) =>
          String(v).toLowerCase().includes(q)
        )
      );
    }
    return result;
  }, [records, search, activeFilters]);

  const pagination = useTablePagination(filteredRecords);
  const columns = activePreset?.columns ?? [];
  const widths = activePreset?.widths ?? {};
  const statusMaster = useTaskStore((s) => s.statusMaster);

  // FIX 1: Passing filteredRecords agar auto-fit bisa hitung teks
  const resize = useTableResize(activePreset?.id, widths, filteredRecords);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (activePresetId && over && active.id !== over.id) {
      const oldIndex = columns.indexOf(active.id as string);
      const newIndex = columns.indexOf(over.id as string);
      reorderColumns(activePresetId, arrayMove(columns, oldIndex, newIndex));
    }
  };

  const handleOpenFilter = (e: React.MouseEvent, col: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFilterPos({ top: rect.bottom + 5, left: rect.left });
    setActiveFilterCol(activeFilterCol === col ? null : col);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
        <TableHeader
          search={search}
          onSearchChange={setSearch}
          onAddPreset={() => { addPreset("Preset Baru", []); setShowEditor(true); }}
          onOpenEditor={() => setShowEditor(true)}
          onOpenFilter={() => {}}
          onOpenEditableColumns={() => setShowEditableColumns(true)}
        />

        {!activePreset ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            Belum ada preset. Klik <b>+ Preset</b> untuk membuat.
        </div>
        ) : (

        <>
          <div className="flex-1 overflow-auto border rounded-lg bg-white custom-scrollbar">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
              <table
                className="text-xs border-collapse"
                style={{ tableLayout: "fixed", width: "max-content" }}
              >
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr>
                    <SortableContext 
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((col) => (
                            <TableHeaderCell
                                key={col}
                                column={col}
                                width={widths[col] ?? DEFAULT_COL_WIDTH}
                                minWidth={MIN_COL_WIDTH}
                                onResize={resize.onMouseDown}
                                onAutoFit={resize.onDoubleClick} // PASSING HANDLER
                                onFilter={handleOpenFilter}
                                isFiltered={activeFilters[col]?.length > 0}
                            />
                        ))}
                    </SortableContext>
                  </tr>
                </thead>

                <tbody>
                  {pagination.rows.map((r) => {
                    const status = statusMaster && statusMaster.status_column ? r.data?.[statusMaster.status_column] : r.data?.StatusPekerjaan;
                    const themeId = columnColors[status] || "gray";
                    const theme = getColorTheme(themeId);

                    return (
                      <tr
                        key={r.row_id}
                        className={`${theme.bg} hover:brightness-95 transition-colors border-b border-white/50`}
                      >
                        {columns.map((col) => {
                            // Hitung lebar spesifik untuk sel ini
                            const colWidth = widths[col] ?? DEFAULT_COL_WIDTH;

                            return (
                              <td
                                key={col}
                                className="px-3 py-2 border-r border-transparent last:border-none overflow-hidden"
                                title={r.data[col]}
                              >
                                 {/* FIX 2: Paksa maxWidth agar truncate jalan */}
                                 <div
                                    className="truncate w-full block"
                                    style={{ maxWidth: `${colWidth - 24}px` }} // 24px = padding kanan kiri
                                 >
                                    {statusMaster && statusMaster.status_column && statusMaster.detail_column ? renderCell(r, col, labelColors, statusMaster.status_column, statusMaster.detail_column) : renderCell(r, col, labelColors)}
                                 </div>
                              </td>
                            )
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </DndContext>
          </div>

          <TableFooter {...pagination} />
        </>
      )}

      {showEditor && activePreset && (
        <PresetEditorModal presetId={activePreset.id} onClose={() => setShowEditor(false)} />
      )}

      {showEditableColumns && (
        <EditableColumnsModal onClose={() => setShowEditableColumns(false)} />
      )}

      {activeFilterCol && (
        <ColumnFilter
            column={activeFilterCol}
            onClose={() => setActiveFilterCol(null)}
            position={filterPos}
        />
      )}
    </div>
  );
}
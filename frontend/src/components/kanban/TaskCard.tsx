import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTaskStore } from "../../state/taskStore";
import { useAppearanceStore } from "../../state/appearanceStore";
import { getColorTheme } from "../../utils/colorPalette";

export default function TaskCard({
  record,
}: {
  record: {
    row_id: number;
    data: Record<string, string>;
  };
}) {
  const statusMaster = useTaskStore((s) => s.statusMaster);
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const { cardFields, labelColors } = useAppearanceStore();

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: record.row_id,
      data: { row_id: record.row_id },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (!statusMaster || !statusMaster.primary) return null;

  const statusColumnName = statusMaster.status_column || "StatusPekerjaan";
  const detailColumnName = statusMaster.detail_column || "Detail Progres";

  const visibleKeys = Object.keys(record.data).filter(key => cardFields.includes(key));
  const finalKeys = visibleKeys.length > 0 ? visibleKeys : ["ID PA"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded shadow p-3 text-xs space-y-3 border border-gray-100 hover:border-blue-300 transition-colors group h-auto"
    >
      {finalKeys.map((key, index) => {
        // FIX: Pastikan value tidak undefined agar tidak jadi uncontrolled component
        const value = record.data[key] ?? "";

        // --- CASE 1: Status Utama ---
        if (key === statusColumnName) {
           return (
             <div key={key} className="pt-1">
                <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider font-semibold">Status</label>
                <select
                    className="border rounded w-full text-xs p-1.5 bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={value}
                    onChange={(e) => updateStatus(record.row_id, e.target.value, undefined)}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {(statusMaster.primary || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
             </div>
           );
        }

        // --- CASE 2: Detail Progres ---
        if (key === detailColumnName) {
           const detailVal = value || "-";
           const detailTheme = getColorTheme(labelColors[detailVal] || "gray");

           return (
             <div key={key} className="pt-1">
                <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider font-semibold">Progres</label>
                <div className="relative">
                    <select
                        className={`appearance-none border rounded w-full text-xs p-1.5 font-medium outline-none cursor-pointer
                            ${detailTheme.bg} ${detailTheme.text} ${detailTheme.border}`}
                        value={detailVal}
                        onChange={(e) => updateStatus(record.row_id, record.data[statusColumnName], e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <option value="-">-</option>
                        {(statusMaster.mapping[record.data[statusColumnName]] ?? []).map((d) => (
                        <option key={d} value={d} className="bg-white text-gray-800">
                            {d}
                        </option>
                        ))}
                    </select>
                    {/* Icon Panah */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
             </div>
           );
        }

        // --- CASE 3: Teks Biasa ---
        const isTitle = index === 0;

        return (
          <div key={key} className={`${isTitle ? "mb-1" : "mb-1"}`}>
             {!isTitle && (
               <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold mb-0.5">
                 {key}
               </span>
             )}
             <div className={`break-words whitespace-pre-wrap leading-relaxed ${isTitle ? "font-bold text-gray-800 text-sm" : "text-gray-600 font-medium"}`}>
               {value || "-"}
             </div>
          </div>
        );
      })}
    </div>
  );
}
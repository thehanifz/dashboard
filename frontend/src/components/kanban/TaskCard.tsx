import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTaskStore } from "../../state/taskStore";

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

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: record.row_id,
      data: { row_id: record.row_id },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (!statusMaster) return null;

  const status = record.data.StatusPekerjaan;
  const detail = record.data["Detail Progres"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded shadow p-2 text-xs space-y-1"
    >
      <div className="font-semibold truncate">
        {record.data["ID PA"] ?? record.row_id}
      </div>

      {/* STATUS */}
      <select
        className="border rounded w-full text-xs"
        value={status}
        onChange={(e) =>
          updateStatus(record.row_id, e.target.value, undefined)
        }
      >
        {statusMaster.primary.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* DETAIL */}
      <select
        className="border rounded w-full text-xs"
        value={detail ?? "-"}
        onChange={(e) =>
          updateStatus(record.row_id, status, e.target.value)
        }
      >
        <option value="-">-</option>
        {(statusMaster.mapping[status] ?? []).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}

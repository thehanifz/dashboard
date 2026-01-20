import { useTaskStore } from "../../state/taskStore";
import { statusColor } from "../../utils/statusColor";

export function StatusCell({ row, col }: any) {
  const statusMaster = useTaskStore((s) => s.statusMaster);
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const value = row.data?.[col] ?? "-";

  if (!statusMaster) return value;

  if (col === "StatusPekerjaan") {
    return (
      <select
        value={value}
        onChange={(e) =>
          updateStatus(row.row_id, e.target.value, undefined)
        }
        className={`text-xs border rounded px-1 py-0.5 w-full ${statusColor(
          value
        )}`}
      >
        {statusMaster.primary.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    );
  }

  const options =
    statusMaster.mapping[row.data?.StatusPekerjaan] ?? [];

  return (
    <select
      value={value}
      onChange={(e) =>
        updateStatus(row.row_id, row.data?.StatusPekerjaan, e.target.value)
      }
      className="text-xs border rounded px-1 py-0.5 w-full"
    >
      <option value="-">-</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { STATUS_COLORS } from "../../utils/statusColor";

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

  const color = STATUS_COLORS[status] ?? {
    bg: "bg-gray-50",
    border: "border-gray-300",
    text: "text-gray-700",
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-80 rounded-lg p-3 border ${
        color.border
      } ${color.bg} ${isOver ? "ring-2 ring-offset-2 ring-blue-300" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold ${color.text}`}>{status}</h3>
        <span className="text-xs text-gray-500">
          {records.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 min-h-[120px]">
        {records.map((r) => (
          <TaskCard key={r.row_id} record={r} />
        ))}
      </div>
    </div>
  );
}

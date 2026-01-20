import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { useTaskStore } from "../../state/taskStore";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard() {
  const records = useTaskStore((s) => s.records);
  const statusMaster = useTaskStore((s) => s.statusMaster);
  const updateStatus = useTaskStore((s) => s.updateStatus);

  if (!statusMaster) return null;

const onDragEnd = (event: any) => {
  const { active, over } = event;
  if (!over) return;

  const rowId = active.data.current?.row_id;
  const nextStatus = over.id;

  if (!rowId || !nextStatus) return;

  updateStatus(rowId, nextStatus, undefined);
};


  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-auto">
        {statusMaster.primary.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            records={records.filter(
              (r) => r.data.StatusPekerjaan === status
            )}
          />
        ))}
      </div>
    </DndContext>
  );
}

import { useEffect, useState } from "react";
import { useTaskStore } from "../state/taskStore";
import KanbanBoard from "../components/kanban/KanbanBoard";
import DynamicTable from "../components/table/DynamicTable";

export default function DashboardPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const fetchRecords = useTaskStore((s) => s.fetchRecords);
  const fetchStatusMaster = useTaskStore((s) => s.fetchStatusMaster);

  useEffect(() => {
    fetchStatusMaster();
    fetchRecords();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            view === "kanban" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("kanban")}
        >
          Kanban
        </button>

        <button
          className={`px-3 py-1 rounded ${
            view === "table" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>

      {view === "kanban" && <KanbanBoard />}
      {view === "table" && <DynamicTable />}
    </div>
  );
}

import { useTaskStore } from "../../state/taskStore";
import { StatusCell } from "./StatusCell";

export function renderCell(row: any, col: string) {
  if (col === "StatusPekerjaan" || col === "Detail Progres") {
    return <StatusCell row={row} col={col} />;
  }
  return <span className="truncate">{row.data?.[col] ?? "-"}</span>;
}

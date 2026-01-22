// PERBAIKAN 1: Gunakan kurung kurawal {} untuk Named Import
import { StatusCell } from "./StatusCell";
import { getColorTheme } from "../../utils/colorPalette";

export const renderCell = (
  record: any,
  column: string,
  labelColors: Record<string, string>,
  statusColumnName: string = "StatusPekerjaan",
  detailColumnName: string = "Detail Progres"
) => {
  const value = record.data?.[column];

  // 1. Render Status Pekerjaan (Dropdown Khusus)
  if (column === statusColumnName) {
    // PERBAIKAN 2: Sesuaikan props dengan StatusCell kamu ({ row, col })
    return <StatusCell row={record} col={column} />;
  }

  // 2. Render Detail Progres (Dropdown Khusus - sama seperti StatusCell tapi untuk detail)
  if (column === detailColumnName) {
    // Kita tetap gunakan StatusCell karena logika untuk detail ada di situ
    return <StatusCell row={record} col={column} />;
  }

  // 3. Render Default (Teks Biasa)
  return <span className="text-gray-700 truncate block">{value ?? "-"}</span>;
};
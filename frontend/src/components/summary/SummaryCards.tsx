import { useTaskStore } from "../../state/taskStore";

export default function SummaryCards() {
  const records = useTaskStore((s) => s.records);
  const statusMaster = useTaskStore((s) => s.statusMaster);

  // 🔒 GUARD
  if (!Array.isArray(records) || !statusMaster) {
    return null;
  }

  const total = records.length;
  const statusColumnName = statusMaster.status_column || "StatusPekerjaan";

  const survey = records.filter(
    (r) => r.data[statusColumnName] === "Survey"
  ).length;

  const onProgress = records.filter(
    (r) => r.data[statusColumnName] === "On Progres"
  ).length;

  const selesai = records.filter(
    (r) => r.data[statusColumnName] === "Done"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card title="Total Pekerjaan" value={total} />
      <Card title="Survey" value={survey} />
      <Card title="On Progress" value={onProgress} />
      <Card title="Selesai" value={selesai} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

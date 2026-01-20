import { useTaskStore } from "../../state/taskStore";

export default function SummaryCards() {
  const records = useTaskStore((s) => s.records);

  // 🔒 GUARD
  if (!Array.isArray(records)) {
    return null;
  }

  const total = records.length;
  const survey = records.filter(
    (r) => r.data["StatusPekerjaan"] === "Survey"
  ).length;

  const onProgress = records.filter(
    (r) => r.data["StatusPekerjaan"] === "On Progres"
  ).length;

  const selesai = records.filter(
    (r) => r.data["StatusPekerjaan"] === "Done"
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

type Props = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string; // Tailwind class, e.g., "bg-blue-500"
};

export default function StatCard({ title, value, icon, color = "bg-white" }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between hover:shadow-md transition-shadow h-full">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-gray-800">
          {value}
        </h3>
      </div>
      
      {icon && (
        <div className={`p-3 rounded-lg text-white shadow-sm ${color}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
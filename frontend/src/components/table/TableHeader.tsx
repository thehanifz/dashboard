
type TablePreset = {
  id: string;
  name: string;
  columns: string[];
  widths?: Record<string, number>;
};

export function TableHeader({
  search,
  onSearchChange,
  onAddPreset,
  onOpenEditor,
  hasActivePreset,
  presets,
  activePresetId,
  onSelectPreset,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onAddPreset: () => void;
  onOpenEditor: () => void;
  hasActivePreset: boolean;
  presets: TablePreset[];
  activePresetId: string | null;
  onSelectPreset: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari data..."
        className="px-2 py-1 text-xs border rounded w-48"
      />

      <div className="flex gap-2">
        <select
          value={activePresetId || ""}
          onChange={(e) => onSelectPreset(e.target.value)}
          className="px-2 py-1 text-xs border rounded"
        >
          <option value="">Pilih Preset...</option>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>

        <button
          className="px-3 py-1 text-xs bg-green-600 text-white rounded"
          onClick={onAddPreset}
        >
          + Preset
        </button>

        {hasActivePreset && (
          <button
            className="px-3 py-1 text-xs bg-gray-200 rounded"
            onClick={onOpenEditor}
          >
            ⚙ Edit
          </button>
        )}
      </div>
    </div>
  );
}

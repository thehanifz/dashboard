import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  column: string;
  width: number;
  minWidth: number;
  onResize: (e: React.MouseEvent, col: string) => void;
  onAutoFit: (e: React.MouseEvent, col: string) => void; // Prop Baru
  onFilter: (e: React.MouseEvent, col: string) => void;
  isFiltered: boolean;
};

export function TableHeaderCell({ 
  column, 
  width, 
  minWidth, 
  onResize, 
  onAutoFit, // Terima prop
  onFilter, 
  isFiltered 
}: Props) {
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: `${width}px`,
    minWidth: `${minWidth}px`,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative px-3 py-3 text-left font-bold text-gray-700 border-b-2 border-gray-100 select-none group hover:bg-gray-100 transition-colors ${
        isDragging ? "bg-blue-50 ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 overflow-hidden">
        <span className="truncate block cursor-grab active:cursor-grabbing flex-1" title={column}>
          {column}
        </span>

        <button
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={(e) => onFilter(e, column)}
          className={`p-1 rounded hover:bg-gray-200 transition-colors shrink-0 ${
            isFiltered ? "text-blue-600 bg-blue-50" : "text-gray-400 opacity-0 group-hover:opacity-100"
          }`}
          title="Filter Kolom"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* RESIZER HANDLE */}
      <div
        onPointerDown={(e) => e.stopPropagation()} 
        onMouseDown={(e) => onResize(e, column)}
        onDoubleClick={(e) => onAutoFit(e, column)} // <--- FITUR EXCEL
        className="absolute top-0 right-0 w-4 h-full cursor-col-resize z-20 flex justify-center group-hover/resizer"
        title="Geser atau Klik 2x untuk Auto-fit"
      >
          <div className="w-[2px] h-full bg-transparent hover:bg-blue-400 transition-colors" />
      </div>
    </th>
  );
}
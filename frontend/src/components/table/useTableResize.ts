import { useEffect, useRef } from "react";
import { usePresetStore } from "../../state/presetStore";

const MIN = 80;
const DEF = 160;

export function useTableResize(
  presetId: string,
  widths: Record<string, number>
) {
  const updateWidth = usePresetStore((s) => s.updateWidth);

  const ref = useRef<{
    col: string;
    startX: number;
    startW: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  function onDown(e: React.MouseEvent, col: string) {
    ref.current = {
      col,
      startX: e.clientX,
      startW: widths[col] ?? DEF,
    };
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function onMove(e: MouseEvent) {
    if (!ref.current) return;
    const dx = e.clientX - ref.current.startX;
    updateWidth(
      presetId,
      ref.current.col,
      Math.max(MIN, ref.current.startW + dx)
    );
  }

  function onUp() {
    ref.current = null;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }

  return { onMouseDown: onDown };
}

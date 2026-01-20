import { create } from "zustand";
import api from "../services/api";

let statusTimer: Record<number, any> = {};

export const useTaskStore = create((set, get) => ({
  columns: [],
  records: [],
  statusMaster: null,

  fetchRecords: async () => {
    const res = await api.get("/records");
    set({
      columns: res.data.columns ?? [],
      records: res.data.records ?? [],
    });
  },

  fetchStatusMaster: async () => {
    const res = await api.get("/status");
    set({ statusMaster: res.data });
  },

  updateStatus: async (
    rowId: number,
    status?: string,
    detail?: string
  ) => {
    // 🧠 OPTIMISTIC UPDATE (UI LANGSUNG GERAK)
    set({
      records: get().records.map((r) =>
        r.row_id === rowId
          ? {
              ...r,
              data: {
                ...r.data,
                ...(status
                  ? { StatusPekerjaan: status }
                  : {}),
                ...(detail
                  ? { "Detail Progres": detail }
                  : {}),
              },
            }
          : r
      ),
    });

    // ⏱️ DEBOUNCE PER ROW
    if (statusTimer[rowId]) {
      clearTimeout(statusTimer[rowId]);
    }

    statusTimer[rowId] = setTimeout(async () => {
      try {
        await api.post(`/records/${rowId}/status`, {
          status,
          detail,
        });
      } catch (err) {
        console.error("updateStatus failed", err);
        // ❌ rollback tidak dilakukan dulu (bisa ditambah nanti)
      }
    }, 400);
  },
}));

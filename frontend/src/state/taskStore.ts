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
    try {
      const res = await api.get("/status");
      set({ statusMaster: res.data });
    } catch (error) {
      console.error("Failed to fetch status master:", error);
      // Set a default statusMaster to prevent breaking the UI
      set({
        statusMaster: {
          primary: [],
          mapping: {},
          status_column: "StatusPekerjaan",
          detail_column: "Detail Progres"
        }
      });
    }
  },

  updateStatus: async (
    rowId: number,
    status?: string,
    detail?: string
  ) => {
    const statusMaster = get().statusMaster;
    const statusColumn = statusMaster?.status_column || "StatusPekerjaan";
    const detailColumn = statusMaster?.detail_column || "Detail Progres";

    // 🧠 OPTIMISTIC UPDATE (UI LANGSUNG GERAK)
    set({
      records: get().records.map((r) =>
        r.row_id === rowId
          ? {
              ...r,
              data: {
                ...r.data,
                ...(status
                  ? { [statusColumn]: status }
                  : {}),
                ...(detail
                  ? { [detailColumn]: detail }
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

import type { AlertColor } from "@mui/material";
import { create } from "zustand";

type Toast = {
  id: number;
  message: string;
  severity: AlertColor;
};

type ToastState = {
  toast: Toast | null;
  showToast: (message: string, severity?: AlertColor) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  showToast: (message, severity = "info") => set({ toast: { id: Date.now(), message, severity } }),
  hideToast: () => set({ toast: null })
}));

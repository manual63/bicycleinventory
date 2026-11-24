import type { PartStatus } from "../../libs/maintenance";

type StatusColor = "error" | "warning" | "success" | "primary";

export const statusMeta: Record<PartStatus, { label: string; color: StatusColor }> = {
  "overdue": { label: "Overdue", color: "error" },
  "due-soon": { label: "Due soon", color: "warning" },
  "on-track": { label: "On track", color: "success" },
  "untracked": { label: "Not tracked", color: "primary" },
};

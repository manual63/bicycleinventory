import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert, AlertTitle, Box, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, Stack, Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useBikeMaintenance } from "../../hooks/useBikeMaintenance";
import { maintenanceModel, needsAttention, type PartEntry } from "../../libs/maintenance";
import type { Bike } from "../../types/bike";
import { getPartTypeInfo, partDisplayName, type BikePart, type NewPart } from "../../types/part";
import ConfirmDialog from "../feedback/ConfirmDialog";
import { PartCard } from "../parts/PartCard";
import { PartForm } from "../parts/PartForm";
import { StatCard } from "./StatCard";

type ComponentsTabProps = {
  bike: Bike;
  entries: PartEntry[];
  defaultInstallDate: string;
  /** Scrolled to and outlined, e.g. when arriving from the calendar. */
  highlightPartId?: string | null;
};

type Filter = "all" | "attention";

type DialogState = { open: boolean } & (
  | { mode: "add" }
  | { mode: "edit"; part: BikePart }
);

const healthCaption = (percent: number) => {
  if (percent >= 75) return "Looking good";
  if (percent >= 50) return "A few things to check";
  return "Time for some service";
};

export const ComponentsTab = ({ bike, entries, defaultInstallDate, highlightPartId }: ComponentsTabProps) => {
  const { addPart, updatePart, removePart, logService } = useBikeMaintenance(bike);
  const [filter, setFilter] = useState<Filter>("all");
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const [partToDelete, setPartToDelete] = useState<BikePart | null>(null);

  useEffect(() => {
    if (!highlightPartId) return;
    document.getElementById(`part-${highlightPartId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [highlightPartId]);

  const attention = entries.filter((entry) => needsAttention(entry.health.status));
  const tracked = entries.filter((entry) => entry.health.status !== "untracked");
  const onTrack = tracked.filter((entry) => entry.health.status === "on-track");
  const systems = new Set(entries.map((entry) => getPartTypeInfo(entry.part.type).category)).size;
  const healthPercent = tracked.length > 0 ? Math.round((onTrack.length / tracked.length) * 100) : null;
  const visible = filter === "attention" ? attention : entries;

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (part: NewPart) => {
    if (dialog.mode === "edit") {
      await updatePart(dialog.part.id, part);
    } else {
      await addPart(part);
    }
    closeDialog();
  };

  const handleDelete = async () => {
    if (!partToDelete) return;
    await removePart(partToDelete.id);
    setPartToDelete(null);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
        <Box>
          <Typography variant="h5" component="h2">Components</Typography>
          <Typography variant="body2" color="text.secondary">
            Track parts, plan maintenance, and catch wear before it catches you.
          </Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, mode: "add" })}>
          Add component
        </Button>
      </Stack>

      {attention.length > 0 && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" endIcon={<ArrowForwardIcon />} onClick={() => setFilter("attention")}>
              Review
            </Button>
          }
        >
          <AlertTitle>
            {attention.length} {attention.length === 1 ? "component needs" : "components need"} your attention
          </AlertTitle>
          One quick check now can prevent a trailside repair later.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Tracked components"
            value={String(entries.length)}
            caption={`Across ${systems} ${systems === 1 ? "system" : "systems"}`}
            icon={PedalBikeIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Needs attention"
            value={String(attention.length)}
            caption={`Overdue or due within ${maintenanceModel.dueSoonDays} days`}
            icon={WarningAmberIcon}
            color={attention.length > 0 ? "error" : "success"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Bike health"
            value={healthPercent === null ? "—" : `${healthPercent}%`}
            caption={healthPercent === null ? "Add maintenance schedules to track" : healthCaption(healthPercent)}
            icon={CheckCircleIcon}
            color="success"
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1}>
        <Chip
          label={`All ${entries.length}`}
          color={filter === "all" ? "primary" : "default"}
          variant={filter === "all" ? "filled" : "outlined"}
          onClick={() => setFilter("all")}
        />
        <Chip
          label={`Attention ${attention.length}`}
          color={filter === "attention" ? "primary" : "default"}
          variant={filter === "attention" ? "filled" : "outlined"}
          onClick={() => setFilter("attention")}
        />
      </Stack>

      {visible.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          {entries.length === 0
            ? "No components yet. Add your fork, chain, tires, and anything else you want to track."
            : "Nothing needs attention right now."}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {visible.map(({ part, health }) => (
            <Grid key={part.id} size={{ xs: 12, md: 6 }}>
              <PartCard
                part={part}
                health={health}
                highlighted={part.id === highlightPartId}
                onEdit={(p) => setDialog({ open: true, mode: "edit", part: p })}
                onDelete={setPartToDelete}
                onLogService={(p) => logService(p)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth>
        <DialogTitle>{dialog.mode === "edit" ? "Edit Component" : "Add Component"}</DialogTitle>
        <DialogContent>
          <PartForm
            part={dialog.mode === "edit" ? dialog.part : undefined}
            defaultInstallDate={defaultInstallDate}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
            submitText={dialog.mode === "edit" ? "Save Changes" : "Add Component"}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={partToDelete !== null}
        title="Remove component?"
        message={partToDelete && <>This removes <strong>{partDisplayName(partToDelete)}</strong> and its maintenance schedule.</>}
        confirmText="Remove"
        confirmColor="error"
        onCancel={() => setPartToDelete(null)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
};

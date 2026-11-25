import { Alert, Grid, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import type { IsoDate } from "../../libs/dates";
import type { PartEntry } from "../../libs/maintenance";
import type { Bike } from "../../types/bike";
import { partDisplayName } from "../../types/part";
import { MaintenanceCalendar, type CalendarEvent } from "../maintenance/MaintenanceCalendar";
import { RideLog } from "../maintenance/RideLog";

type MaintenanceTabProps = {
  bike: Bike;
  entries: PartEntry[];
  today: IsoDate;
  onSelectPart: (partId: string) => void;
};

export const MaintenanceTab = ({ bike, entries, today, onSelectPart }: MaintenanceTabProps) => {
  const events: CalendarEvent[] = entries.flatMap(({ part, health }) =>
    health.dueDate
      ? [{ date: health.dueDate, partId: part.id, label: partDisplayName(part), status: health.status, estimated: health.estimated }]
      : [],
  );

  // Mileage parts with no riding pace yet can't be placed on the calendar.
  const unscheduled = entries.filter(({ health }) => health.status !== "untracked" && !health.dueDate);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <MaintenanceCalendar events={events} onSelectPart={onSelectPart} today={today} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3}>
          <RideLog bike={bike} today={today} />
          {unscheduled.length > 0 && (
            <Alert severity="info" variant="outlined">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Log some miles to put these on the calendar:
              </Typography>
              <List dense disablePadding>
                {unscheduled.map(({ part, health }) => (
                  <ListItemButton key={part.id} onClick={() => onSelectPart(part.id)} sx={{ borderRadius: 2, px: 1 }}>
                    <ListItemText primary={partDisplayName(part)} secondary={health.summary} />
                  </ListItemButton>
                ))}
              </List>
            </Alert>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

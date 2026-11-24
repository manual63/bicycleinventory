import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box, Button, Card, CardContent, Chip, IconButton, List, ListItemButton, ListItemText, Stack, Tooltip, Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDate, parseIsoDate, todayIso, toIsoDate, type IsoDate } from "../../libs/dates";
import type { PartStatus } from "../../libs/maintenance";
import { statusMeta } from "./statusMeta";

export type CalendarEvent = {
  date: IsoDate;
  partId: string;
  label: string;
  status: PartStatus;
  estimated: boolean;
};

type MaintenanceCalendarProps = {
  events: CalendarEvent[];
  onSelectPart: (partId: string) => void;
  today?: IsoDate;
};

type Month = { year: number; month: number }; // month is 0-11

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const MAX_CHIPS = 2;

const monthOf = (iso: IsoDate): Month => {
  const date = parseIsoDate(iso);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
};

const shiftMonth = ({ year, month }: Month, by: number): Month => {
  const date = new Date(Date.UTC(year, month + by, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
};

/** Leading nulls pad the first week so day 1 lands under its weekday. */
const buildMonthCells = ({ year, month }: Month): (IsoDate | null)[] => {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toIsoDate(new Date(Date.UTC(year, month, i + 1)))),
  ];
};

const eventLabel = (event: CalendarEvent) => `${event.label}${event.estimated ? " (est.)" : ""}`;

export const MaintenanceCalendar = ({ events, onSelectPart, today = todayIso() }: MaintenanceCalendarProps) => {
  const [visibleMonth, setVisibleMonth] = useState<Month>(() => monthOf(today));
  const cells = buildMonthCells(visibleMonth);
  const monthPrefix = toIsoDate(new Date(Date.UTC(visibleMonth.year, visibleMonth.month, 1))).slice(0, 7);

  const eventsByDate = new Map<IsoDate, CalendarEvent[]>();
  for (const event of events) {
    eventsByDate.set(event.date, [...(eventsByDate.get(event.date) ?? []), event]);
  }
  const monthEvents = events
    .filter((event) => event.date.startsWith(monthPrefix))
    .toSorted((a, b) => a.date.localeCompare(b.date));

  const isCurrentMonth = monthPrefix === today.slice(0, 7);

  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: "center", mb: 2 }} spacing={1}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {monthFormat.format(new Date(Date.UTC(visibleMonth.year, visibleMonth.month, 1)))}
          </Typography>
          {!isCurrentMonth && (
            <Button size="small" onClick={() => setVisibleMonth(monthOf(today))}>Today</Button>
          )}
          <IconButton aria-label="Previous month" onClick={() => setVisibleMonth((m) => shiftMonth(m, -1))}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton aria-label="Next month" onClick={() => setVisibleMonth((m) => shiftMonth(m, 1))}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 0.5 }}>
          {weekdays.map((day) => (
            <Typography key={day} variant="caption" color="text.secondary" sx={{ textAlign: "center", pb: 0.5 }}>
              {day}
            </Typography>
          ))}
          {cells.map((date, index) => {
            if (!date) return <Box key={`blank-${index}`} />;
            const dayEvents = eventsByDate.get(date) ?? [];
            const isToday = date === today;
            return (
              <Box
                key={date}
                sx={{
                  minHeight: { xs: 48, sm: 92 },
                  p: 0.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: isToday ? "primary.main" : "divider",
                  bgcolor: dayEvents.length > 0 ? (theme) => theme.alpha(theme.palette.primary.main, 0.04) : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: isToday ? 700 : 400, color: isToday ? "primary.main" : "text.primary" }}
                >
                  {parseIsoDate(date).getUTCDate()}
                </Typography>

                {/* Small screens: dots. The list below the grid carries the labels. */}
                <Stack direction="row" spacing={0.5} sx={{ display: { xs: "flex", sm: "none" }, flexWrap: "wrap" }}>
                  {dayEvents.map((event) => (
                    <Box
                      key={event.partId}
                      component="button"
                      aria-label={eventLabel(event)}
                      onClick={() => onSelectPart(event.partId)}
                      sx={{
                        width: 8, height: 8, p: 0, border: 0, borderRadius: "50%", cursor: "pointer",
                        bgcolor: `${statusMeta[event.status].color}.main`,
                      }}
                    />
                  ))}
                </Stack>

                {/* Larger screens: clickable chips. */}
                <Stack spacing={0.5} sx={{ display: { xs: "none", sm: "flex" }, minWidth: 0 }}>
                  {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                    <Tooltip key={event.partId} title={eventLabel(event)}>
                      <Chip
                        size="small"
                        label={event.label}
                        color={statusMeta[event.status].color}
                        variant={event.estimated ? "outlined" : "filled"}
                        onClick={() => onSelectPart(event.partId)}
                        sx={{ maxWidth: "100%", justifyContent: "flex-start" }}
                      />
                    </Tooltip>
                  ))}
                  {dayEvents.length > MAX_CHIPS && (
                    <Typography variant="caption" color="text.secondary">+{dayEvents.length - MAX_CHIPS} more</Typography>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 3 }}>Due this month</Typography>
        {monthEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Nothing scheduled.</Typography>
        ) : (
          <List dense disablePadding>
            {monthEvents.map((event) => (
              <ListItemButton key={event.partId} onClick={() => onSelectPart(event.partId)} sx={{ borderRadius: 2 }}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: "50%", mr: 1.5, flexShrink: 0, bgcolor: `${statusMeta[event.status].color}.main` }}
                />
                <ListItemText
                  primary={event.label}
                  secondary={`${event.estimated ? "Estimated · " : ""}${formatDate(event.date)} · ${statusMeta[event.status].label}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Outlined chips are estimated from your recent riding pace.
        </Typography>
      </CardContent>
    </Card>
  );
};

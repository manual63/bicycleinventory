import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box, Button, Card, CardContent, Grid, IconButton, List, ListItem, ListItemText, Stack, Typography,
} from "@mui/material";
import { useState } from "react";
import { useBikeMaintenance } from "../../hooks/useBikeMaintenance";
import { formatDate, type IsoDate } from "../../libs/dates";
import { maintenanceModel, ridingPace, totalMiles } from "../../libs/maintenance";
import type { Bike } from "../../types/bike";
import { LogRideDialog } from "./LogRideDialog";

type RideLogProps = {
  bike: Bike;
  today: IsoDate;
};

const RECENT_RIDES = 5;
const formatMiles = (miles: number) => (Math.round(miles * 10) / 10).toLocaleString();

export const RideLog = ({ bike, today }: RideLogProps) => {
  const { removeRide } = useBikeMaintenance(bike);
  const [open, setOpen] = useState(false);
  const { rides } = bike;
  const recent = rides.toSorted((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT_RIDES);
  const weeklyPace = ridingPace(rides, today) * 7;
  const paceWeeks = maintenanceModel.paceWindowDays / 7;

  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h3">Ride log</Typography>
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Log ride
          </Button>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid size={6}>
            <Typography variant="overline" color="text.secondary">Total</Typography>
            <Typography variant="h6" component="p">{formatMiles(totalMiles(rides))} mi</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="overline" color="text.secondary">Avg / week</Typography>
            <Typography variant="h6" component="p">{formatMiles(weeklyPace)} mi</Typography>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary">
          Average over the last {paceWeeks} weeks. It's used to estimate when mileage-based parts come due.
        </Typography>

        {recent.length === 0 ? (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">No rides logged yet.</Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ mt: 1 }}>
            {recent.map((ride) => (
              <ListItem
                key={ride.id}
                disableGutters
                secondaryAction={
                  <IconButton edge="end" aria-label="Delete ride" size="small" onClick={() => removeRide(ride.id).catch(() => {})}>
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText primary={`${formatMiles(ride.miles)} mi`} secondary={[formatDate(ride.date), ride.note].filter(Boolean).join(" · ")} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      <LogRideDialog bike={bike} open={open} onClose={() => setOpen(false)} />
    </Card>
  );
};

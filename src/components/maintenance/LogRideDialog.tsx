import { Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useBikeMaintenance } from "../../hooks/useBikeMaintenance";
import { totalMiles } from "../../libs/maintenance";
import type { Bike } from "../../types/bike";
import type { NewRide } from "../../types/part";
import { AnimatedBike } from "./AnimatedBike";
import { RideForm } from "./RideForm";

type LogRideDialogProps = {
  bike: Bike;
  open: boolean;
  onClose: () => void;
};

/**
 * The one "log a ride" dialog, used from the bike list, the bike page header, and the ride log.
 * It owns the save so callers only control open/close.
 */
export const LogRideDialog = ({ bike, open, onClose }: LogRideDialogProps) => {
  const { addRide } = useBikeMaintenance(bike);
  const miles = Math.round(totalMiles(bike.rides) * 10) / 10;

  const handleSubmit = async (ride: NewRide) => {
    await addRide(ride);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>
        Log a ride
        <Typography variant="body2" color="text.secondary">
          {bike.brand} {bike.model}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <AnimatedBike />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            {miles > 0
              ? `${miles.toLocaleString()} mi logged so far. Every mile counts toward the next service.`
              : "First ride! Every mile counts toward the next service."}
          </Typography>
          <RideForm onSubmit={handleSubmit} onCancel={onClose} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

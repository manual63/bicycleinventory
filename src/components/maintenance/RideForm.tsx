import { Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { todayIso, type IsoDate } from "../../libs/dates";
import { withInputRef } from "../../libs/utils";
import type { NewRide } from "../../types/part";

type RideFormValues = { date: IsoDate; miles: number; note: string };

type RideFormProps = {
  onSubmit: (ride: NewRide) => void | Promise<void>;
  onCancel: () => void;
};

export const RideForm = ({ onSubmit, onCancel }: RideFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RideFormValues>({
    defaultValues: { date: todayIso(), note: "" },
  });

  const handleValid = async ({ date, miles, note }: RideFormValues) => {
    try {
      await onSubmit({ date, miles, note: note.trim() || undefined });
    } catch {
      // onSubmit reports its own errors
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(handleValid)} spacing={2} sx={{ my: 1 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...withInputRef(register("date", {
            required: "Date is required",
            validate: (v) => v <= todayIso() || "Can't log a future ride",
          }))}
          type="date"
          label="Date"
          error={!!errors.date}
          helperText={errors.date?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <TextField
          {...withInputRef(register("miles", {
            valueAsNumber: true,
            validate: (v) => (Number.isFinite(v) && v > 0) || "Enter miles above 0",
          }))}
          type="number"
          label="Distance"
          autoFocus
          error={!!errors.miles}
          helperText={errors.miles?.message}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mi</InputAdornment> },
            htmlInput: { min: 0, step: "any" },
          }}
          fullWidth
        />
      </Stack>
      <TextField {...withInputRef(register("note"))} label="Note" placeholder="Trail, route, conditions…" />
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" loading={isSubmitting}>Log Ride</Button>
        <Button variant="text" onClick={onCancel}>Cancel</Button>
      </Stack>
    </Stack>
  );
};

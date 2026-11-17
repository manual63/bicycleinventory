import { Stack, Typography } from "@mui/material";
import type { WheelPressure } from "../../types/tirePressure";
import { PressureReadout } from "./PressureReadout";

export const PressureColumn = ({ title, pressure }: { title: string; pressure: WheelPressure }) => (
  <Stack spacing={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
    <Stack direction="row" spacing={2}>
      <PressureReadout label="Front" psi={pressure.front} />
      <PressureReadout label="Rear" psi={pressure.rear} />
    </Stack>
  </Stack>
);

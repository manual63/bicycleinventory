import { Box, Typography } from "@mui/material";
import { psiToBar } from "../../libs/tirePressure";

export const PressureReadout = ({ label, psi }: { label: string; psi: number }) => (
  <Box
    sx={{
      flex: 1,
      p: 2,
      borderRadius: 2,
      bgcolor: "background.paper",
      border: 1,
      borderColor: "divider",
    }}
  >
    <Typography variant="overline" color="text.secondary">{label}</Typography>
    <Typography variant="h3" component="p" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
      {psi.toFixed(1)}
      <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>psi</Typography>
    </Typography>
    <Typography variant="body2" color="text.secondary">{psiToBar(psi).toFixed(2)} bar</Typography>
  </Box>
);

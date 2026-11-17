import TireRepairIcon from "@mui/icons-material/TireRepair";
import { Alert, Box, Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { calculateTirePressure } from "../../libs/tirePressure";
import type { TirePressureInput } from "../../types/tirePressure";
import { PressureColumn } from "./PressureColumn";
import { TrailConditionGuide } from "./TrailConditionsGuide";

export const Results = () => {
  const { control } = useFormContext<TirePressureInput>();
  const values = useWatch({ control }) as TirePressureInput;
  const { isValid } = useFormState({ control });

  if (!isValid) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent>
          <Alert severity="info">Fix the highlighted fields to see your pressures.</Alert>
        </CardContent>
      </Card>
    );
  }

  const result = calculateTirePressure(values);

  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: (theme) => theme.alpha(theme.palette.primary.main, 0.06) }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <TireRepairIcon sx={{ color: "primary.main" }} />
            <Typography variant="h5" component="h2">Starting pressures</Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PressureColumn title="Without inserts" pressure={result.withoutInserts} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {result.withInserts ? (
                <PressureColumn title="With inserts" pressure={result.withInserts} />
              ) : (
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>With inserts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inserts need a tubeless setup. Turn on Tubeless to see these numbers.
                  </Typography>
                </Stack>
              )}
            </Grid>
          </Grid>

          {result.limitedToRange && (
            <Alert severity="warning">
              Some values hit the calculator's safe range. Double-check your inputs, and check
              your tire and rim manufacturer's limits.
            </Alert>
          )}

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Dialing it in</Typography>
            <Typography variant="body2" color="text.secondary">
              Treat these as a starting point. On a trail you know, drop 1–2 psi per run until the
              tire squirms in corners or you feel rim strikes, then add a little back. Check
              pressure with a digital gauge before every ride. Never go above the maximum printed
              on your tire or rim.
            </Typography>
          </Box>

          <TrailConditionGuide />
        </Stack>
      </CardContent>
    </Card>
  );
};

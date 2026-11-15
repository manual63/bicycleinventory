import TireRepairIcon from "@mui/icons-material/TireRepair";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormProvider, useForm, useFormContext, useFormState, useWatch } from "react-hook-form";
import { SelectController } from "../components/Controllers/Select.controller";
import { SwitchController } from "../components/Controllers/Switch.controller";
import { calculateTirePressure, psiToBar } from "../libs/tirePressure";
import {
  casingLabels,
  defaultTirePressureInput,
  ridingSurfaceLabels,
  wheelSetupLabels,
  type TirePressureInput,
  type WheelPressure,
} from "../types/tirePressure";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const casingOptions = toOptions(casingLabels);
const wheelSetupOptions = toOptions(wheelSetupLabels);
const surfaceOptions = toOptions(ridingSurfaceLabels);

export const TirePressurePage = () => {
  const methods = useForm<TirePressureInput>({
    defaultValues: defaultTirePressureInput,
    mode: "onChange",
  });
  const { control } = methods;

  return (
    <FormProvider {...methods}>
      <Stack spacing={1} sx={{ my: 3 }}>
        <Typography variant="h3" component="h1">Tire Pressure Calculator</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          A starting point for mountain bike tire pressure, based on your weight, tires, and rims.
          Results update as you type.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2.5}>
                <SectionLabel>Rider &amp; bike</SectionLabel>
                <NumberField name="riderWeight" label="Rider weight" unit="lb" min={60} max={400}
                  helperText="Include gear: pack, water, armor" />
                <NumberField name="bikeWeight" label="Bike weight" unit="lb" min={15} max={80} />

                <SectionLabel>Tires &amp; wheels</SectionLabel>
                <SelectController name="casing" control={control} label="Tire casing" options={casingOptions} />
                <SelectController name="wheelSetup" control={control} label="Wheel size" options={wheelSetupOptions} />
                <Stack direction="row" spacing={2}>
                  <NumberField name="frontTireWidth" label="Front tire" unit="in" min={1.8} max={3.0} step={0.1} />
                  <NumberField name="rearTireWidth" label="Rear tire" unit="in" min={1.8} max={3.0} step={0.1} />
                </Stack>
                <NumberField name="rimWidth" label="Inner rim width" unit="mm" min={19} max={45} />
                <SwitchController name="tubeless" control={control} label="Tubeless" />

                <SectionLabel>Conditions</SectionLabel>
                <SelectController name="surface" control={control} label="Trail surface" options={surfaceOptions} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Results />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
    {children}
  </Typography>
);

// Only the keys of TirePressureInput whose value is a number.
type NumericField = {
  [K in keyof TirePressureInput]: TirePressureInput[K] extends number ? K : never;
}[keyof TirePressureInput];

type NumberFieldProps = {
  name: NumericField;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  helperText?: string;
};

const NumberField = ({ name, label, unit, min, max, step = 1, helperText }: NumberFieldProps) => {
  const { register, formState: { errors } } = useFormContext<TirePressureInput>();
  const { ref, ...field } = register(name, {
    valueAsNumber: true,
    validate: (value) => !Number.isNaN(value) || `${label} is required`,
    min: { value: min, message: `Minimum is ${min} ${unit}` },
    max: { value: max, message: `Maximum is ${max} ${unit}` },
  });
  const error = errors[name];

  return (
    <TextField
      {...field}
      inputRef={ref}
      label={label}
      type="number"
      fullWidth
      error={!!error}
      helperText={error?.message ?? helperText}
      slotProps={{
        input: { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> },
        htmlInput: { step, min, max },
      }}
    />
  );
};

const Results = () => {
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

type TrailConditionTip = {
  condition: string;
  direction: "lower" | "higher" | "same";
  adjustment: string;
  reason: string;
  note?: string;  // optional callout shown under the reason
};

const trailConditionTips: TrailConditionTip[] = [
  {
    condition: "Hardpack / smooth and fast",
    direction: "higher",
    adjustment: "+1–2 psi",
    reason: "Less rolling resistance and a crisper feel in berms. Grip is already good.",
  },
  {
    condition: "Loose over hard",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A bigger contact patch helps the knobs find grip through the marbles.",
  },
  {
    condition: "Loose, dusty, or deep loam",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A softer tire digs in and tracks better instead of skating on top.",
  },
  {
    condition: "Rocky and chunky",
    direction: "higher",
    adjustment: "+1–3 psi",
    reason: "Protects the rim and prevents pinch flats. Add more to the rear, or run inserts and stay closer to baseline.",
  },
  {
    condition: "Roots and wet rock",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "A supple tire wraps over slick roots and rock instead of deflecting off them.",
  },
  {
    condition: "Mud and wet",
    direction: "lower",
    adjustment: "−1–2 psi",
    reason: "More bite in soft ground. The Wet setting above already takes off 1 psi, so don't double up.",
    note: "Respect trail rules about riding in wet conditions.",
  },
  {
    condition: "Bike park, big jumps, high speed",
    direction: "higher",
    adjustment: "+3–5 psi",
    reason: "Hard landings and high-speed compressions need support. The rear takes the biggest hits.",
  },
  {
    condition: "Cold mornings",
    direction: "same",
    adjustment: "Set at the trailhead",
    reason: "Pressure drops about 1 psi for every 10°F colder. Check it outside, not in a warm garage.",
  },
];

const directionColor = {
  lower: "info",
  higher: "warning",
  same: "default",
} as const;

const TrailConditionGuide = () => (
  <Box>
    <Typography variant="subtitle2" gutterBottom>Adjusting for trail conditions</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
      General adjustments from the numbers above. Start small and change one thing at a time.
    </Typography>
    <Stack divider={<Divider flexItem />} spacing={1.5}>
      {trailConditionTips.map((tip) => (
        <Stack
          key={tip.condition}
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 0.5, sm: 2 }}
          sx={{ alignItems: { sm: "flex-start" } }}
        >
          <Box sx={{ minWidth: { sm: 150 } }}>
            <Chip
              label={tip.adjustment}
              size="small"
              color={directionColor[tip.direction]}
              variant="outlined"
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{tip.condition}</Typography>
            <Typography variant="body2" color="text.secondary">{tip.reason}</Typography>
            {tip.note && (
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ mt: 1, py: 0, "& .MuiAlert-message": { fontWeight: 600 } }}
              >
                {tip.note}
              </Alert>
            )}
          </Box>
        </Stack>
      ))}
    </Stack>
  </Box>
);

const PressureColumn =({ title, pressure }: { title: string; pressure: WheelPressure }) => (
  <Stack spacing={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
    <Stack direction="row" spacing={2}>
      <PressureReadout label="Front" psi={pressure.front} />
      <PressureReadout label="Rear" psi={pressure.rear} />
    </Stack>
  </Stack>
);

const PressureReadout = ({ label, psi }: { label: string; psi: number }) => (
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

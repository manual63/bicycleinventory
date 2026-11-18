
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { SelectController } from "../components/controllers/Select.controller";
import { SwitchController } from "../components/controllers/Switch.controller";
import { NumberField } from "../components/tirePressure/NumberField";
import { Results } from "../components/tirePressure/Results";
import { toOptions } from "../libs/utils";
import {
  casingLabels,
  defaultTirePressureInput,
  ridingSurfaceLabels,
  wheelSetupLabels,
  type TirePressureInput
} from "../types/tirePressure";

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

import { Button, InputAdornment, ListSubheader, MenuItem, Stack, TextField } from "@mui/material";
import { Controller, FormProvider, useForm, useFormContext, useFormState, useWatch } from "react-hook-form";
import { todayIso, type IsoDate } from "../../libs/dates";
import { withInputRef } from "../../libs/utils";
import {
  getPartTypeInfo,
  partCategoryLabels,
  partTypes,
  type BikePart,
  type IntervalUnit,
  type NewPart,
  type PartCategory,
  type PartType,
} from "../../types/part";
import { SelectController } from "../controllers/Select.controller";

/**
 * Form shape ≠ domain shape. Inputs hold strings and "none" is a real choice here;
 * toFormValues/toNewPart convert at the edges so BikePart never sees "" or "none".
 */
type PartFormValues = {
  type: PartType | "";
  brand: string;
  model: string;
  details: string;
  installDate: IsoDate;
  lastServiced: IsoDate | "";
  intervalUnit: IntervalUnit | "none";
  intervalEvery: string;
};

const toFormValues = (part: BikePart | undefined, defaultInstallDate: IsoDate): PartFormValues => ({
  type: part?.type ?? "",
  brand: part?.brand ?? "",
  model: part?.model ?? "",
  details: part?.details ?? "",
  installDate: part?.installDate ?? defaultInstallDate,
  lastServiced: part?.lastServiced ?? "",
  intervalUnit: part?.interval?.unit ?? "none",
  intervalEvery: part?.interval ? String(part.interval.every) : "",
});

const toNewPart = (values: PartFormValues): NewPart => ({
  type: values.type as PartType, // `required` rule guarantees it's not ""
  brand: values.brand.trim(),
  model: values.model.trim(),
  details: values.details.trim() || undefined,
  installDate: values.installDate,
  lastServiced: values.lastServiced || undefined,
  interval: values.intervalUnit === "none"
    ? undefined
    : { unit: values.intervalUnit, every: Number(values.intervalEvery) },
});

const intervalUnitOptions: { value: PartFormValues["intervalUnit"]; label: string }[] = [
  { value: "none", label: "No schedule" },
  { value: "miles", label: "By miles" },
  { value: "months", label: "By time" },
];

// Group the dropdown by category: a ListSubheader followed by that category's types.
const typeMenuItems = (Object.keys(partCategoryLabels) as PartCategory[]).flatMap((category) => [
  <ListSubheader key={`header-${category}`}>{partCategoryLabels[category]}</ListSubheader>,
  ...(Object.keys(partTypes) as PartType[])
    .filter((type) => getPartTypeInfo(type).category === category)
    .map((type) => <MenuItem key={type} value={type}>{getPartTypeInfo(type).label}</MenuItem>),
]);

type PartFormProps = {
  /** Omit to add a new part. */
  part?: BikePart;
  defaultInstallDate: IsoDate;
  onSubmit: (part: NewPart) => void | Promise<void>;
  onCancel: () => void;
  submitText?: string;
};

export const PartForm = ({ part, defaultInstallDate, onSubmit, onCancel, submitText = "Save" }: PartFormProps) => {
  const methods = useForm<PartFormValues>({ defaultValues: toFormValues(part, defaultInstallDate) });
  const { register, control, handleSubmit, setValue, getFieldState, formState: { errors } } = methods;
  const [type, intervalUnit] = useWatch({ control, name: ["type", "intervalUnit"] });
  const task = type ? getPartTypeInfo(type).task : undefined;

  const handleValid = async (values: PartFormValues) => {
    try {
      await onSubmit(toNewPart(values));
    } catch {
      // onSubmit reports its own errors; failing keeps the user's input
    }
  };

  // When adding, picking a type pre-fills its default interval, unless the user already set one.
  const prefillInterval = (newType: PartType) => {
    if (part) return;
    if (getFieldState("intervalUnit").isDirty || getFieldState("intervalEvery").isDirty) return;
    const interval = getPartTypeInfo(newType).defaultInterval;
    setValue("intervalUnit", interval?.unit ?? "none");
    setValue("intervalEvery", interval ? String(interval.every) : "");
  };

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={handleSubmit(handleValid)} spacing={2} sx={{ my: 1 }}>
        <Controller
          name="type"
          control={control}
          rules={{ required: "Part type is required" }}
          render={({ field: { ref, onChange, ...field }, fieldState }) => (
            <TextField
              {...field}
              inputRef={ref}
              onChange={(event) => {
                onChange(event);
                prefillInterval(event.target.value as PartType);
              }}
              select
              label="Type"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {typeMenuItems}
            </TextField>
          )}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            {...withInputRef(register("brand", { validate: (v) => v.trim() !== "" || "Brand is required" }))}
            label="Brand"
            placeholder="Fox"
            error={!!errors.brand}
            helperText={errors.brand?.message}
            fullWidth
          />
          <TextField
            {...withInputRef(register("model", { validate: (v) => v.trim() !== "" || "Model is required" }))}
            label="Model"
            placeholder="36 Factory GRIP2"
            error={!!errors.model}
            helperText={errors.model?.message}
            fullWidth
          />
        </Stack>
        <TextField
          {...withInputRef(register("details"))}
          label="Details"
          placeholder="160mm travel, 44mm offset, 35mm clamp"
          multiline
          minRows={2}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            {...withInputRef(register("installDate", {
              required: "Install date is required",
              validate: (v) => v <= todayIso() || "Install date can't be in the future",
            }))}
            type="date"
            label="Installed"
            error={!!errors.installDate}
            helperText={errors.installDate?.message}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            {...withInputRef(register("lastServiced", {
              validate: (v, values) =>
                !v || v >= values.installDate || "Can't be before the install date",
            }))}
            type="date"
            label="Last serviced"
            error={!!errors.lastServiced}
            helperText={errors.lastServiced?.message ?? "Leave blank if never serviced"}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <SelectController
            name="intervalUnit"
            control={control}
            label="Maintenance"
            options={intervalUnitOptions}
          />
          <TextField
            {...withInputRef(register("intervalEvery", {
              validate: (v, values) =>
                values.intervalUnit === "none" || Number(v) > 0 || "Enter a number above 0",
            }))}
            type="number"
            label="Every"
            disabled={intervalUnit === "none"}
            error={!!errors.intervalEvery}
            helperText={errors.intervalEvery?.message ?? (task && `Task: ${task}`)}
            slotProps={{
              input: {
                endAdornment: intervalUnit !== "none" && (
                  <InputAdornment position="end">{intervalUnit === "miles" ? "mi" : "months"}</InputAdornment>
                ),
              },
              htmlInput: { min: 1, step: "any" },
            }}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <SubmitButton>{submitText}</SubmitButton>
          <Button variant="text" onClick={onCancel}>Cancel</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { control } = useFormContext<PartFormValues>();
  const { isDirty, isSubmitting } = useFormState({ control });
  return <Button type="submit" variant="contained" disabled={!isDirty || isSubmitting}>{children}</Button>;
};

import { Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { FormProvider, useForm, useFormContext, useFormState, useWatch } from "react-hook-form";
import { todayIso } from "../../libs/dates";
import { toOptions } from "../../libs/utils";
import { bikeBrands, bikeTypeLabels, frameMaterialLabels, suspensionTypeLabels, type NewBike } from "../../types/bike";
import { AutocompleteController } from "../controllers/Autocomplete.controller";
import { RadioGroupController } from "../controllers/RadioGroup.controller";
import { SelectController } from "../controllers/Select.controller";
import { SwitchController } from "../controllers/Switch.controller";

// List of popular bike brands
const popularBrands = ["Pivot", "Trek", "Specialized"];

type BikeFormProps = {
  initialValues?: Partial<NewBike>;
  onSubmit: (data: NewBike) => void | Promise<void>;
  buttonText?: string;
};

const bikeTypeOptions = toOptions(bikeTypeLabels);
const frameMaterialOptions = toOptions(frameMaterialLabels);
const suspensionTypeOptions = toOptions(suspensionTypeLabels);

const BikeForm = ({ initialValues, onSubmit, buttonText = "Save" }: BikeFormProps) => {
  const methods = useForm<NewBike>({
    // Collections default to [] so the bike always has them; parts/rides are edited on the detail page.
    defaultValues: { isElectric: false, serialNumber: undefined, acquiredDate: undefined, parts: [], rides: [], ...initialValues },
  });
  const { register, handleSubmit, reset, control, formState: { errors } } = methods;

  const handleValid = async (data: NewBike) => {
    try {
      await onSubmit(data);
      reset();
    } catch {
      // onSubmit reports its own errors; failing keeps the users input data
    }
  };

  const { ref: modelRef, ...modelField } = register("model", {
    required: "Model is required",
  });

  const { ref: yearRef, ...yearField } = register("year", {
    required: "Year is required",
    valueAsNumber: true,
    min: { value: 1980, message: "Year must be 1980 or later" },
    max: { value: new Date().getFullYear() + 1, message: "Year cannot be in the future" },
    validate: (value) => !Number.isNaN(value) || "Year must be a number",
  });

  const { ref: serialNumberRef, ...serialNumberField } = register("serialNumber", {
    setValueAs: (value: string) => value.trim() === "" ? undefined : value.trim(),
  });

  const { ref: acquiredDateRef, ...acquiredDateField } = register("acquiredDate", {
    setValueAs: (value: string) => value === "" ? undefined : value,
    validate: (value) => !value || value <= todayIso() || "Date can't be in the future",
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={handleSubmit(handleValid)} spacing={2} sx={{ my: 2 }}>
        <BikePreview />
        <AutocompleteController
          name="brand"
          control={control}
          label="Brand"
          options={bikeBrands}
          rules={{
            required: "Brand is required",
            validate: (v) => !/^\s*$/.test(v) || "Brand can't be blank"
          }}
          renderOptionEnd={(brand) =>
            popularBrands.includes(brand) && <Chip label="Popular" size="small" sx={{ ml: "auto" }} />
          }
        />
        <TextField
          {...modelField}
          inputRef={modelRef}
          label="Model"
          error={!!errors.model}
          helperText={errors.model?.message}
        />
        <TextField
          {...yearField}
          inputRef={yearRef}
          label="Year"
          error={!!errors.year}
          helperText={errors.year?.message}
          type="number"
        />
        <TextField
          {...serialNumberField}
          inputRef={serialNumberRef}
          label="Serial Number"
          error={!!errors.serialNumber}
          helperText={errors.serialNumber?.message}
        />
        <TextField
          {...acquiredDateField}
          inputRef={acquiredDateRef}
          type="date"
          label="Acquired / Built"
          error={!!errors.acquiredDate}
          helperText={errors.acquiredDate?.message ?? "New parts default their install date to this"}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <SelectController
          name="frameMaterial"
          options={frameMaterialOptions}
          label="Frame Material"
          control={control}
          rules={{ required: "Frame Material is required" }}
        />
        <RadioGroupController
          name="suspension"
          options={suspensionTypeOptions}
          label="Suspension"
          control={control}
          rules={{ required: "Suspension Type is required" }}
        />
        <SelectController
          name="type"
          options={bikeTypeOptions}
          label="Type"
          control={control}
          rules={{ required: "Bicycle Type is required" }}
        />
        <SwitchController
          name="isElectric"
          label="Electric"
          control={control}
        />
        <SubmitButton>
          {buttonText}
        </SubmitButton>
      </Stack>
    </FormProvider>
  );
};

export default BikeForm;

const BikePreview = () => {
  const { control } = useFormContext<NewBike>();
  const values = useWatch({ control });

  return (
    <Typography variant="body2">{values.brand} {values.model} {values.year} {values.type}</Typography>
  )
}

const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { control } = useFormContext<NewBike>();
  const { isDirty, isSubmitting } = useFormState({ control });

  return <Button type="submit" disabled={!isDirty || isSubmitting} variant="outlined">{children}</Button>
}

import { Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { FormProvider, useForm, useFormContext, useFormState, useWatch, useFieldArray } from "react-hook-form";
import { bikeBrands, bikeTypeLabels, frameMaterialLabels, type NewBike } from "../types/bike";
import { AutocompleteController } from "./Controllers/Autocomplete.controller";
import { SelectController } from "./Controllers/Select.controller";
import { SwitchController } from "./Controllers/Switch.controller";

// List of popular bike brands
const popularBrands = ["Pivot", "Trek", "Specialized"];

type BikeFormProps = {
  initialValues?: Partial<NewBike>;
  onSubmit: (data: NewBike) => void | Promise<void>;
  buttonText?: string;
};

const BikeForm = ({ initialValues, onSubmit, buttonText = "Save" }: BikeFormProps) => {
  const methods = useForm<NewBike>({
    defaultValues: { isElectric: false, serialNumber: undefined, parts: [], ...initialValues },
  });
  const { register, handleSubmit, reset, control, formState: { errors } } = methods;

  const handleValid = async (data: NewBike) => {
    await onSubmit(data);
    reset();
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

  const bikeTypeOptions = Object.entries(bikeTypeLabels).map(([value, label]) => ({ value, label }));
  const frameMaterialOptions = Object.entries(frameMaterialLabels).map(([value, label]) => ({ value, label }));

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
        <SelectController
          name="frameMaterial"
          options={frameMaterialOptions}
          label="Frame Material"
          control={control}
          rules={{ required: "Frame Material is required" }}
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
        <PartsFields />
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

const PartsFields = () => {
  const { control, register, formState: { errors } } = useFormContext<NewBike>();
  const { fields, append, remove } = useFieldArray({ control, name: "parts" });

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Parts</Typography>
      {fields.map((part, index) => {
        const { ref: nameRef, ...nameField } = register(`parts.${index}.name`, { required: "Part name is required" });
        const { ref: costRef, ...costField } = register(`parts.${index}.cost`, { valueAsNumber: true, required: "Cost is required" });

        return (
          <Stack key={part.id} direction="row" spacing={1}>
            {/* a TextField for name, one for cost, and a remove button */}
            <TextField
              {...nameField}
              inputRef={nameRef}
              label="Name"
              error={!!errors.parts?.[index]?.name}
              helperText={errors.parts?.[index]?.name?.message}
            />
            <TextField
              {...costField}
              inputRef={costRef}
              label="Cost"
              error={!!errors.parts?.[index]?.cost}
              helperText={errors.parts?.[index]?.cost?.message}
            />
            <Button onClick={() => remove(index)}>Remove</Button>
          </Stack>
        )
      })}
      <Button onClick={() => append({ name: "", cost: 0})}>Add part</Button>
    </Stack>

  );
}

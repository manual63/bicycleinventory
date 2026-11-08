import { Button, Chip, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useBikeStore } from "../store/bikeStore";
import { bikeBrands, bikeTypeLabels, frameMaterialLabels, type NewBike } from "../types/bike";
import { AutocompleteController } from "./Controllers/Autocomplete.controller";
import { SelectController } from "./Controllers/Select.controller";
import { SwitchController } from "./Controllers/Switch.controller";

// List of popular bike brands
const popularBrands = ["Pivot", "Trek", "Specialized"];

const AddBikeForm = () => {
  const addBike = useBikeStore((s) => s.addBike);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<NewBike>({
    defaultValues: { isElectric: false },
  });

  const onSubmit = (data: NewBike) => {
    console.log("Submitting new bike:", data);
    addBike(data);
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
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} sx={{ my: 2 }}>
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
      <Button type="submit" variant="contained">
        Add Bike
      </Button>
    </Stack>
  );
};

export default AddBikeForm;
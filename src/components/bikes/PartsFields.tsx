import { Button, Stack, TextField, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { NewBike } from "../../types/bike";

export const PartsFields = () => {
  const { control, register, formState: { errors } } = useFormContext<Pick<NewBike, "parts">>();
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
      <Button onClick={() => append({ name: "", cost: 0 })}>Add part</Button>
    </Stack>

  );
};

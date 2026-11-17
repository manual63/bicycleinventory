import { InputAdornment, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { TirePressureInput } from "../../types/tirePressure";

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

export const NumberField = ({ name, label, unit, min, max, step = 1, helperText }: NumberFieldProps) => {
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

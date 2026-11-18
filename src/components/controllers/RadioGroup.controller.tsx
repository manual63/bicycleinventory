import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useId } from "react";
import { useController, type Control, type FieldPath, type FieldValues, type UseControllerProps } from "react-hook-form";
import type { SelectOption } from "../../types/input";

type RadioGroupControllerProps<T extends FieldValues, TName extends FieldPath<T>> = UseControllerProps<T, TName> & {
  control: Control<T>;
  label: string;
  options: SelectOption[];
};

export function RadioGroupController<T extends FieldValues, TName extends FieldPath<T>>({
  label,
  options,
  ...controllerProps
}: RadioGroupControllerProps<T, TName>) {
  const { field: { ref, onChange, onBlur, name, disabled, ...field }, fieldState } = useController(controllerProps);
  const id = useId();

  return (
    <FormControl error={!!fieldState.error} disabled={disabled}>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={id}
        value={field.value ?? ""}
        onChange={(_event, value) => onChange(value)}
        name={name}
        onBlur={onBlur}
      >
        {options.map((option) => (
          <FormControlLabel key={option.value} value={option.value} label={option.label} control={<Radio />} />
        ))}
      </RadioGroup>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
};

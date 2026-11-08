import { MenuItem, TextField } from "@mui/material";
import { useController, type Control, type FieldPath, type FieldValues, type UseControllerProps } from "react-hook-form";

type SelectOption = { value: string; label: string };

type SelectControllerProps<T extends FieldValues, TName extends FieldPath<T>> = UseControllerProps<T, TName> & {
  control: Control<T>;
  label: string;
  options: SelectOption[];
};

export function SelectController<T extends FieldValues, TName extends FieldPath<T>>({
  label,
  options,
  ...controllerProps
}: SelectControllerProps<T, TName>) {
  const { field: { ref, ...field }, fieldState } = useController(controllerProps);

  return (
    <TextField {...field} value={field.value ?? ""} inputRef={ref} select label={label} error={!!fieldState.error} helperText={fieldState.error?.message}>
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>{label}</MenuItem>
      ))}
    </TextField>
  )

}
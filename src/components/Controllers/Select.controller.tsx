import { MenuItem, TextField } from "@mui/material";
import { useController, type Control, type FieldValues, type UseControllerProps } from "react-hook-form";

type SelectOption = { value: string; label: string };

type SelectControllerProps<T extends FieldValues> = UseControllerProps<T> & {
  control: Control<T>;
  label: string;
  options: SelectOption[];
};

export function SelectController<T extends FieldValues>({
  label,
  options,
  ...controllerProps
}: SelectControllerProps<T>) {
  const { field: { ref, ...field }, fieldState } = useController(controllerProps);

  return (
    <TextField {...field} value={field.value ?? ""} inputRef={ref} select label={label} error={!!fieldState.error} helperText={fieldState.error?.message}>
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>{label}</MenuItem>
      ))}
    </TextField>
  )

}
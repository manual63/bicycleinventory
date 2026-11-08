import { FormControlLabel, Switch } from '@mui/material';
import { useController, type Control, type FieldPath, type FieldValues, type UseControllerProps } from 'react-hook-form';

type SwitchControllerProps<T extends FieldValues, TName extends FieldPath<T>> = UseControllerProps<T, TName> & {
  control: Control<T>;
  label: string;
};

export function SwitchController<T extends FieldValues, TName extends FieldPath<T>>({
  label,
  ...controllerProps
}: SwitchControllerProps<T, TName>) {
  const { field: { ref, onChange, value, ...field }, } = useController(controllerProps);

  return (
    <FormControlLabel
      label={label}
      control={
        <Switch
          {...field}
          checked={value ?? false}
          onChange={(_event, checked) => onChange(checked)}
          slotProps={{ input: { ref } }}
        />
      }
    />
  )
};

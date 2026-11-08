import { Autocomplete, Paper, TextField, Typography, type PaperProps } from "@mui/material";
import { useController, type Control, type FieldPath, type FieldValues, type UseControllerProps } from "react-hook-form";

type AutocompleteControllerProps<T extends FieldValues, TName extends FieldPath<T>> = UseControllerProps<T, TName> & {
  control: Control<T>;
  label: string;
  options: readonly string[];   // readonly so an `as const` list also fits
  renderOptionEnd?: (option: string) => React.ReactNode;
};

function PaperWithHint(props: PaperProps) {
  return (
    <Paper {...props}>
      <Typography variant="caption" sx={{ px: 2, py: 1, display: "block", color: "text.secondary" }}>
        Not listed? Just type it.
      </Typography>
      {props.children}
    </Paper>
  );
}

export function AutocompleteController<T extends FieldValues, TName extends FieldPath<T>>({ label, options, renderOptionEnd, ...controllerProps }: AutocompleteControllerProps<T, TName>) {
  const { field: { ref, onChange, value, ...field }, fieldState } = useController(controllerProps);

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={value ?? ""}
      onInputChange={(_event, value) => onChange(value)}
      renderInput={(params) => (
        <TextField {...field} {...params} inputRef={ref} label={label} helperText={fieldState.error?.message} error={!!fieldState.error} />
      )}
      slotProps={{
        paper: { elevation: 8 },
        listbox: { sx: { maxHeight: 200 } },
      }}
      slots={{ paper: PaperWithHint }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option}
            {renderOptionEnd?.(option)}
          </li>

        )
      }}
    />
  );
}
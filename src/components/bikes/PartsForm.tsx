import { Button, Stack } from "@mui/material";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import { type BikePart, type NewBike } from "../../types/bike";
import { PartsFields } from "./PartsFields";

export type PartsFormValues = Pick<NewBike, "parts">;

type PartsFormProps = {
  parts: BikePart[];
  onSubmit: (data: PartsFormValues) => void | Promise<void>;
  onClose: () => void;
  buttonText?: string;
};

export const PartsForm = ({ parts, onSubmit, onClose, buttonText = "Save" }: PartsFormProps) => {
  const methods = useForm<PartsFormValues>({
    defaultValues: { parts },
  });
  const { handleSubmit } = methods;

  const handleValid = async (data: PartsFormValues) => {
    try {
      await onSubmit(data);
    } catch {
      // onSubmit reports its own errors; failing keeps the users input data
    }
  };


  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={handleSubmit(handleValid)} spacing={2} sx={{ my: 2 }}>
        <PartsFields />
        <Stack direction="row" spacing={2}>
          <SubmitButton>
            {buttonText}
          </SubmitButton>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { control } = useFormContext<NewBike>();
  const { isDirty, isSubmitting } = useFormState({ control });

  return <Button type="submit" disabled={!isDirty || isSubmitting} variant="outlined">{children}</Button>
}

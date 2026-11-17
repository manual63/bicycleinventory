import { Alert, AlertTitle, Button } from "@mui/material";

type ErrorStateProps = {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Alert
      severity="error"
      action={<Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}
      sx={{my: 2}}
    >
      <AlertTitle>Couldn't load your bikes</AlertTitle>
      Something went wrong reaching storage. Try again.
    </Alert>
  );
}

export default ErrorState;

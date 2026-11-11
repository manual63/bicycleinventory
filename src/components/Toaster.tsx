import { Alert, Snackbar, type SnackbarCloseReason } from "@mui/material";
import { useToastStore } from "../store/toastStore";

const Toaster = () => {
  const toast = useToastStore((s) => s.toast);
  const hideToast = useToastStore((s) => s.hideToast);

  if (!toast) return null;

  const handleClose = (_event: unknown, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    hideToast();
  };

  return (
    <Snackbar
      key={toast.id}
      open
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={toast.severity} variant="filled" onClose={hideToast}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, type ButtonProps } from "@mui/material";
import { useState, type ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: ButtonProps["color"];
};

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
}: ConfirmDialogProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => {
        if (!isPending) onCancel();
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isPending}>{cancelText}</Button>
        <Button onClick={handleConfirm} color={confirmColor} variant="outlined" loading={isPending}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;

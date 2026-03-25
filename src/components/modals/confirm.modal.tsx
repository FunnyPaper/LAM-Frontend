import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

export type ConfirmModalProps = {
  open: boolean;
  title?: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};

export function ConfirmModal({
  open,
  title = 'Are you sure?',
  content = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonColor = 'error',
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <DialogContentText>{content}</DialogContentText>
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button onClick={onCancel}>{cancelButtonText}</Button>
            <Button onClick={onConfirm} color={confirmButtonColor} variant="contained">
              {confirmButtonText}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

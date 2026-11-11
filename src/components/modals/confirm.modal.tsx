import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export type ConfirmModalProps = {
  title?: string;
  content?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};

function ConfirmModalInner({
  title = 'Are you sure?',
  content = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonColor = 'error',
}: ConfirmModalProps) {
  const modal = useModal();

  const handleConfirm = () => {
    onConfirm();
    modal.remove();
  };

  const handleCancel = () => {
    onCancel?.();
    modal.remove();
  };

  return (
    <Dialog open onClose={handleCancel} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <DialogContentText>{content}</DialogContentText>
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button onClick={handleCancel}>{cancelButtonText}</Button>
            <Button onClick={handleConfirm} color={confirmButtonColor} variant="contained">
              {confirmButtonText}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export const ConfirmModal = NiceModal.create(ConfirmModalInner);

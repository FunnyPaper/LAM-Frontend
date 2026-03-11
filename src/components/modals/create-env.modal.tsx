import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CreateEnvDto } from '../../api/commands/env/create.env.provider';
import { Close } from '@mui/icons-material';
import EnvForm from '../forms/env.form';

export type CreateEnvModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateEnvDto) => void;
};

export default function CreateEnvModal({
  open,
  onClose,
  onCreate,
}: CreateEnvModalProps) {
  const { t } = useTranslation('envs');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('createModal.title')}</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close />
      </IconButton>
      <Divider />
      <DialogContent>
        <EnvForm onSubmit={onCreate} />
      </DialogContent>
    </Dialog>
  );
}

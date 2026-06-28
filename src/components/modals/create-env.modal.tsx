import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CreateEnvDto } from '../../api/commands/env/create.env.provider';
import { Close } from '@mui/icons-material';
import { EnvForm } from '../forms/env.form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';

export type CreateEnvModalProps = {
  onCreate: (data: CreateEnvDto) => void;
};

function CreateEnvModalInner({ onCreate }: CreateEnvModalProps) {
  const { t } = useTranslation('envs');
  const modal = useModal();

  const handleCreate = useCallback(
    (data: CreateEnvDto) => {
      onCreate(data);
      modal.remove();
    },
    [onCreate, modal]
  );

  return (
    <Dialog open onClose={modal.remove} fullWidth>
      <DialogTitle>{t('createModal.title')}</DialogTitle>
      <IconButton
        onClick={modal.remove}
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
        <EnvForm<CreateEnvDto> onSubmit={handleCreate} />
      </DialogContent>
    </Dialog>
  );
}

export const CreateEnvModal = NiceModal.create(CreateEnvModalInner);
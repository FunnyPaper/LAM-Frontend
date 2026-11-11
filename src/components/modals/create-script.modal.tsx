import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CreateScriptDto } from '../../api/commands/script/create.script.provider';
import { Close } from '@mui/icons-material';
import { ScriptForm } from '../forms/script.form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';

export type CreateScriptModalProps = {
  onCreate: (data: CreateScriptDto) => void;
};

function CreateScriptModalInner({ onCreate }: CreateScriptModalProps) {
  const { t } = useTranslation('scripts');
  const modal = useModal();

  const handleCreate = useCallback(
    (data: CreateScriptDto) => {
      onCreate(data);
      modal.remove();
    },
    [onCreate, modal]
  );

  return (
    <Dialog open onClose={modal.remove} fullWidth>
      <DialogTitle>{t('modal.create.title')}</DialogTitle>
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
        <ScriptForm<CreateScriptDto> onSubmit={handleCreate} />
      </DialogContent>
    </Dialog>
  );
}

export const CreateScriptModal = NiceModal.create(CreateScriptModalInner);

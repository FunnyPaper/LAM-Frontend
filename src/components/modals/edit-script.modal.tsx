import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { ScriptForm } from '../forms/script.form';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';
import type { ScriptDto } from 'lam-frontend/api/queries/script.provider';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';

export type EditScriptModalProps = {
  script: ScriptDto;
  onEdit: (data: UpdateScriptDto) => void;
};

function EditScriptModalInner({ script, onEdit }: EditScriptModalProps) {
  const { t } = useTranslation('scripts');
  const modal = useModal();

  const handleEdit = useCallback(
    (data: UpdateScriptDto) => {
      onEdit(data);
      modal.remove();
    },
    [onEdit, modal]
  );

  return (
    <Dialog open onClose={modal.remove} fullWidth>
      <DialogTitle>{t('modal.update.title')}</DialogTitle>
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
        <ScriptForm<UpdateScriptDto> script={script} onSubmit={handleEdit} />
      </DialogContent>
    </Dialog>
  );
}

export const EditScriptModal = NiceModal.create(EditScriptModalInner);

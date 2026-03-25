import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { ScriptForm } from '../forms/script.form';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';
import type { ScriptDto } from 'lam-frontend/api/queries/script.provider';

export type EditScriptModalProps = {
  open: boolean;
  onClose: () => void;
  script: ScriptDto;
  onEdit: (data: UpdateScriptDto) => void;
};

export function EditScriptModal({ open, onClose, script, onEdit }: EditScriptModalProps) {
  const { t } = useTranslation('scripts');

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t('modal.update.title')}</DialogTitle>
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
        <ScriptForm<UpdateScriptDto> script={script} onSubmit={onEdit} />
      </DialogContent>
    </Dialog>
  );
}

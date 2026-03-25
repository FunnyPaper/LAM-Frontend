import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CreateScriptDto } from '../../api/commands/script/create.script.provider';
import { Close } from '@mui/icons-material';
import { ScriptForm } from '../forms/script.form';

export type CreateScriptModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateScriptDto) => void;
};

export function CreateScriptModal({ open, onClose, onCreate }: CreateScriptModalProps) {
  const { t } = useTranslation('scripts');

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t('modal.create.title')}</DialogTitle>
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
        <ScriptForm<CreateScriptDto> onSubmit={onCreate} />
      </DialogContent>
    </Dialog>
  );
}

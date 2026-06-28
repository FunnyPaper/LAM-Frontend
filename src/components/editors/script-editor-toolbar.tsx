import { Box, Chip, IconButton, Stack, TextField, Tooltip, outlinedInputClasses } from '@mui/material';
import { Archive, Download, FileUpload, Publish, Save, SaveAs, Warning } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ScriptVersionDto } from 'lam-frontend/api';
import { getScriptVersionStateColor } from 'lam-frontend/utils/colors';

export type ScriptEditorToolbarProps = {
  scriptVersion?: ScriptVersionDto;
  name: string;
  onNameChange: (name: string) => void;
  content: string;
  initialContent: string;
  isValid: boolean;
  saving: boolean;
  saveButtonRef: React.Ref<HTMLButtonElement>;
  onDownload: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ScriptEditorToolbar({
  scriptVersion,
  name,
  onNameChange,
  content,
  initialContent,
  isValid,
  saving,
  saveButtonRef,
  onDownload,
  onSave,
  onSaveAs,
  onPublish,
  onArchive,
  onUpload,
}: ScriptEditorToolbarProps) {
  const { t } = useTranslation('scripts');
  const isEdited = content !== initialContent;

  return (
    <Box
      sx={{
        backgroundColor: 'paper',
        borderBottom: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
        <Stack direction="row" flex={1} alignItems="center">
          {(scriptVersion?.status !== 'Draft' && isEdited) && (
            <Tooltip title={t('editor.warning.nonDraftEdit')}>
              <Box sx={{ padding: '5px', display: 'inline-flex', color: 'warning.dark' }}>
                <Warning />
              </Box>
            </Tooltip>
          )}
          <TextField
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            sx={{
              [`& .${outlinedInputClasses.root}`]: {
                fontSize: '0.8rem',
                borderRadius: 0,
              },
              [`& .${outlinedInputClasses.input}`]: {
                px: 2,
                py: 1,
              },
            }}
          />
          <Chip
            label={t(`version.status.${(scriptVersion?.status ?? 'Draft').toLowerCase()}`)}
            size="small"
            variant="filled"
            color={getScriptVersionStateColor(scriptVersion?.status ?? 'Draft')}
          />
        </Stack>
        <Box sx={{ display: 'flex', flex: 0 }}>
          <IconButton size="small" title={t('editor.upload')} component="label" sx={{ borderRadius: 0 }}>
            <input type="file" hidden onChange={onUpload} accept=".json,application/json" />
            <FileUpload />
          </IconButton>
          <IconButton
            size="small"
            onClick={onDownload}
            title={t('editor.download')}
            sx={{ borderRadius: 0 }}
          >
            <Download />
          </IconButton>
          <IconButton
            ref={saveButtonRef}
            color="primary"
            size="small"
            onClick={onSave}
            disabled={!isValid || saving || !isEdited}
            title={t('editor.save')}
            sx={{ borderRadius: 0 }}
          >
            <Save />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={onSaveAs}
            disabled={!isValid || saving || !isEdited}
            title={t('editor.saveAs')}
            sx={{ borderRadius: 0 }}
          >
            <SaveAs />
          </IconButton>
          {scriptVersion && scriptVersion.status !== 'Published' && (
            <IconButton
              sx={{ borderRadius: 0 }}
              size="small"
              title={t('editor.publish')}
              onClick={onPublish}
            >
              <Publish />
            </IconButton>
          )}
          {scriptVersion && scriptVersion.status !== 'Archived' && (
            <IconButton
              sx={{ borderRadius: 0 }}
              size="small"
              title={t('editor.archive')}
              onClick={onArchive}
            >
              <Archive />
            </IconButton>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
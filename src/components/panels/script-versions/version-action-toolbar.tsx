import { IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Archive, ArrowBack, ForkLeft, Publish, Visibility, Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ScriptVersionDto } from 'lam-frontend/api';
import type { ViewType } from 'lam-frontend/components/modals/preview-script.modal';

export type VersionActionToolbarProps = {
  selectedView: ViewType;
  onSelectView: (event: React.MouseEvent<HTMLElement>, value: ViewType | null) => void;
  onBack: () => void;
  scriptVersion: ScriptVersionDto;
};

export function VersionActionToolbar({ selectedView, onSelectView, onBack, scriptVersion }: VersionActionToolbarProps) {
  const { t } = useTranslation('scripts');

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <Tooltip title={t('modal.preview.backToList')}>
        <IconButton onClick={onBack} sx={{ borderRadius: 0, padding: '11px' }}>
          <ArrowBack fontSize="small" />
        </IconButton>
      </Tooltip>
      <ToggleButtonGroup value={selectedView} exclusive onChange={onSelectView}>
        <Tooltip title={t('modal.preview.viewContent.title')}>
          <ToggleButton
            value="view"
            sx={{
              border: 'none',
              borderRadius: 0,
            }}
          >
            <Visibility fontSize="small" />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t('modal.preview.fork.title')}>
          <ToggleButton
            value="fork"
            sx={{
              border: 'none',
              borderRadius: 0,
            }}
          >
            <ForkLeft fontSize="small" />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t('modal.preview.edit.title')}>
          <ToggleButton
            value="edit"
            sx={{
              border: 'none',
              borderRadius: 0,
            }}
          >
            <Edit fontSize="small" />
          </ToggleButton>
        </Tooltip>
        {scriptVersion.status !== 'Published' && (
          <Tooltip title={t('modal.preview.publish.title')}>
            <ToggleButton
              value="publish"
              sx={{
                border: 'none',
                borderRadius: 0,
              }}
            >
              <Publish fontSize="small" />
            </ToggleButton>
          </Tooltip>
        )}
        {scriptVersion.status !== 'Archived' && (
          <Tooltip title={t('modal.preview.archive.title')}>
            <ToggleButton
              value="archive"
              sx={{
                border: 'none',
                borderRadius: 0,
              }}
            >
              <Archive fontSize="small" />
            </ToggleButton>
          </Tooltip>
        )}
        <Tooltip title={t('modal.preview.delete.title')}>
          <ToggleButton
            value="delete"
            sx={{
              border: 'none',
              borderRadius: 0,
            }}
          >
            <Delete fontSize="small" />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Stack>
  );
}

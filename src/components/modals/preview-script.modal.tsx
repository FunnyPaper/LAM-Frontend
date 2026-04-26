import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TablePagination,
    tablePaginationClasses,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Archive, ArrowBack, Close, Delete, Edit, ForkLeft, Publish, Visibility } from '@mui/icons-material';
import type { ScriptDto, ScriptVersionDto } from 'lam-frontend/api';
import { useCallback, useContext, useMemo, useState } from 'react';
import { getScriptVersionStateColor } from 'lam-frontend/utils/colors';
import { PreviewScriptVersionPanel } from '../panels/script-versions/preview-script-version.panel';
import { PublishScriptVersionPanel } from '../panels/script-versions/publish-script-version.panel';
import { ForkScriptVersionPanel } from '../panels/script-versions/fork-script-version.panel';
import { EditScriptVersionPanel } from '../panels/script-versions/edit-script-version.panel';
import { RemoveScriptVersionPanel } from '../panels/script-versions/remove-script-version.panel';
import { ArchiveScriptVersionPanel } from '../panels/script-versions/archive-script-version.panel';
import { ApiProvider } from 'lam-frontend/providers';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';

export type PreviewScriptModalProps = {
  open: boolean;
  onClose: () => void;
  script: ScriptDto | null;
  onEdit: (scriptVersion: ScriptVersionDto) => void;
  onArchive: (scriptVersion: ScriptVersionDto) => Promise<void>;
  onPublish: (scriptVersion: ScriptVersionDto, data: { name: string }) => Promise<void>;
  onRemove: (scriptVersion: ScriptVersionDto) => Promise<void>;
  onFork: (scriptVersion: ScriptVersionDto) => Promise<void>;
};

// TODO: Refactor later - this component is just massive compared to the others

export type PaginationParams = {
  page: number;
  limit: number;
};

const defaultScriptVersionSearchParams: PaginationParams = {
  page: 0,
  limit: 10,
};

type ViewType = 'view' | 'archive' | 'fork' | 'delete' | 'publish' | 'edit';

export function PreviewScriptModal({
  open,
  onClose,
  script,
  onEdit,
  onArchive,
  onPublish,
  onRemove,
  onFork,
}: PreviewScriptModalProps) {
  const { t } = useTranslation('scripts');
  const [selectedVersion, setSelectedVersion] = useState<ScriptVersionDto | null>(null);
  const [selectedView, setSelectedView] = useState<ViewType>('view');
  const [searchParams, setSearchParams] = useState<PaginationParams>(defaultScriptVersionSearchParams);

  const {
    scriptVersion: { getAll },
  } = useContext(ApiProvider)!;
  const scriptVersionsDatasource = useMemo(
    () =>
      script &&
      getAll(script.id, {
        ...searchParams,
        sort: { field: 'updatedAt', order: 'desc' },
      }),
    [getAll, script, searchParams]
  );
  const { data: scriptVersions, invalidate: invalidateScriptVersion } = useDataSourceHook(scriptVersionsDatasource);

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setSearchParams({
        ...searchParams,
        page: newPage,
      });
    },
    [setSearchParams, searchParams]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setSearchParams({
        ...searchParams,
        page: 0,
        limit: newRowsPerPage,
      });
    },
    [setSearchParams, searchParams]
  );

  const handleSelectView = (event: React.MouseEvent<HTMLElement>, value: ViewType | null) => {
    if (value != null) {
      setSelectedView(value);
    }
  };

  const handleBack = useCallback(() => {
    setSelectedVersion(null);
    setSelectedView('view');
  }, [setSelectedVersion, setSelectedView]);

  const handlePublish = useCallback(
    async (version: ScriptVersionDto, data: { name: string }) => {
      await onPublish(version, data);
      await invalidateScriptVersion();
      handleBack();
    },
    [handleBack, invalidateScriptVersion, onPublish]
  );

  const handleArchive = useCallback(
    async (version: ScriptVersionDto) => {
      await onArchive(version);
      await invalidateScriptVersion();
      handleBack();
    },
    [handleBack, invalidateScriptVersion, onArchive]
  );

  const handleRemove = useCallback(
    async (version: ScriptVersionDto) => {
      await onRemove(version);
      await invalidateScriptVersion();
      handleBack();
    },
    [handleBack, invalidateScriptVersion, onRemove]
  );

  const handleFork = useCallback(
    async (version: ScriptVersionDto) => {
      await onFork(version);
      await invalidateScriptVersion();
      handleBack();
    },
    [handleBack, invalidateScriptVersion, onFork]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        transition: {
          onExited: handleBack,
        },
        paper: {
          sx: {
            height: '600px',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle>{t('modal.preview.title')}</DialogTitle>
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
        <Stack direction="row" gap={2} height="100%" width="100%">
          {!selectedVersion && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                height: '100%',
                flex: 1,
                minHeight: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'clip',
              }}
            >
              <Box
                sx={(theme) => ({
                  display: 'grid',
                  justifyContent: 'start',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 2,
                  backgroundColor: theme.palette.background.paper,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                })}
              >
                <Typography>{t('table.name')}</Typography>
                <Typography>{t('table.status')}</Typography>
                <Typography>{t('table.createdAt')}</Typography>
              </Box>
              <Box
                sx={(theme) => ({
                  display: 'grid',
                  gridAutoRows: 'min-content',
                  overflowY: 'auto',
                  minHeight: 0,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[400],
                  },
                })}
              >
                {scriptVersions?.data.map((version) => (
                  <Box
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    sx={(theme) => ({
                      display: 'grid',
                      justifyContent: 'start',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 2,
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    })}
                  >
                    <Typography noWrap textOverflow="ellipsis" fontSize={14}>
                      {version.name ?? '-'}
                    </Typography>
                    <Chip
                      label={t(`version.status.${version.status.toLowerCase()}`)}
                      size="small"
                      variant="filled"
                      color={getScriptVersionStateColor(version.status)}
                    />

                    <Typography noWrap textOverflow="ellipsis" fontSize={14}>
                      {version.createdAt ?? '-'}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <TablePagination
                  component="div"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.paper,
                    [`& .${tablePaginationClasses.selectLabel}`]: {
                      margin: 0,
                    },
                    [`& .${tablePaginationClasses.displayedRows}`]: {
                      margin: 0,
                    },
                    [`& .${tablePaginationClasses.toolbar}`]: {
                      minHeight: 0,
                    },
                  })}
                  count={scriptVersions?.metadata.totalItems ?? 0}
                  page={searchParams.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={searchParams.limit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelDisplayedRows={({ page }) => `${t('table.displayedRows')} ${page + 1}`}
                  labelRowsPerPage={t('table.rowsPerPage')}
                  size="small"
                />
              </Box>
            </Box>
          )}
          {selectedVersion && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr',
                overflowY: 'auto',
                flex: 1,
                minHeight: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'clip',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                <Tooltip title={t('modal.preview.backToList')}>
                  <IconButton onClick={handleBack} sx={{ borderRadius: 0, padding: '11px' }}>
                    <ArrowBack fontSize="small" />
                  </IconButton>
                </Tooltip>
                <ToggleButtonGroup value={selectedView} exclusive onChange={handleSelectView}>
                  <ToggleButton
                    title={t('modal.preview.viewContent.title')}
                    value="view"
                    sx={{
                      border: 'none',
                      borderRadius: 0,
                    }}
                  >
                    <Visibility fontSize="small" />
                  </ToggleButton>
                  <ToggleButton
                    title={t('modal.preview.fork.title')}
                    value="fork"
                    sx={{
                      border: 'none',
                      borderRadius: 0,
                    }}
                  >
                    <ForkLeft fontSize="small" />
                  </ToggleButton>
                  <ToggleButton
                    title={t('modal.preview.edit.title')}
                    value="edit"
                    sx={{
                      border: 'none',
                      borderRadius: 0,
                    }}
                  >
                    <Edit fontSize="small" />
                  </ToggleButton>
                  {selectedVersion.status != 'Published' && (
                    <ToggleButton
                      title={t('modal.preview.publish.title')}
                      value="publish"
                      sx={{
                        border: 'none',
                        borderRadius: 0,
                      }}
                    >
                      <Publish fontSize="small" />
                    </ToggleButton>
                  )}
                  {selectedVersion.status != 'Archived' && (
                    <ToggleButton
                      title={t('modal.preview.archive.title')}
                      value="archive"
                      sx={{
                        border: 'none',
                        borderRadius: 0,
                      }}
                    >
                      <Archive fontSize="small" />
                    </ToggleButton>
                  )}
                  <ToggleButton
                    title={t('modal.preview.delete.title')}
                    value="delete"
                    sx={{
                      border: 'none',
                      borderRadius: 0,
                    }}
                  >
                    <Delete fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Divider />
              {selectedView === 'view' && (
                <PreviewScriptVersionPanel content={JSON.stringify(selectedVersion.content.astJson, null, 2)} />
              )}
              {selectedView === 'publish' && (
                <PublishScriptVersionPanel
                  header={t('modal.preview.publish.title')}
                  info={t('modal.preview.publish.info')}
                  scriptVersion={selectedVersion}
                  onPublish={handlePublish}
                  labels={{
                    confirm: t('modal.preview.publish.confirm'),
                    name: t('modal.preview.publish.name'),
                    validation: {
                      required: t('modal.preview.publish.validation.required'),
                      minLength: (num) => t('modal.preview.publish.validation.minLength', { num }),
                      maxLength: (num) => t('modal.preview.publish.validation.maxLength', { num }),
                    },
                  }}
                />
              )}
              {selectedView === 'fork' && (
                <ForkScriptVersionPanel
                  header={t('modal.preview.fork.title')}
                  info={t('modal.preview.fork.info')}
                  scriptVersion={selectedVersion}
                  onFork={handleFork}
                  labels={{ confirm: t('modal.preview.fork.confirm') }}
                />
              )}
              {selectedView === 'edit' && (
                <EditScriptVersionPanel
                  header={t('modal.preview.edit.title')}
                  info={t('modal.preview.edit.info')}
                  scriptVersion={selectedVersion}
                  onEdit={onEdit}
                  labels={{ confirm: t('modal.preview.edit.confirm') }}
                />
              )}
              {selectedView === 'delete' && (
                <RemoveScriptVersionPanel
                  header={t('modal.preview.delete.title')}
                  info={t('modal.preview.delete.info')}
                  scriptVersion={selectedVersion}
                  onRemove={handleRemove}
                  labels={{ confirm: t('modal.preview.delete.confirm') }}
                />
              )}
              {selectedView === 'archive' && (
                <ArchiveScriptVersionPanel
                  header={t('modal.preview.archive.title')}
                  info={t('modal.preview.archive.info')}
                  scriptVersion={selectedVersion}
                  onArchive={handleArchive}
                  labels={{ confirm: t('modal.preview.archive.confirm') }}
                />
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

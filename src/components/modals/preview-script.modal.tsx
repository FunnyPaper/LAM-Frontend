import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';
import type { ScriptDto, ScriptVersionDto } from 'lam-frontend/api';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import type { DataSource } from 'lam-frontend/api/resources/datasource';
import type { GetScriptVersionsProviderParams } from 'lam-frontend/api/queries/script-version.provider';
import { useCallback, useMemo, useState } from 'react';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import { ScriptVersionListPanel } from '../panels/script-versions/script-version-list.panel';
import { VersionActionToolbar } from '../panels/script-versions/version-action-toolbar';
import { VersionDetailPanel } from '../panels/script-versions/version-detail-panel';

export type PreviewScriptModalProps = {
  script: ScriptDto | null;
  onEdit: (scriptVersion: ScriptVersionDto) => void;
  onArchive: (scriptVersion: ScriptVersionDto) => Promise<void>;
  onPublish: (scriptVersion: ScriptVersionDto, data: { name: string }) => Promise<void>;
  onRemove: (scriptVersion: ScriptVersionDto) => Promise<void>;
  onFork: (scriptVersion: ScriptVersionDto) => Promise<void>;
  getScriptVersionsDataSourceFactory: ((scriptId: string, params?: GetScriptVersionsProviderParams) => DataSource<Paginated<ScriptVersionDto>>) | null;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

const defaultScriptVersionSearchParams: PaginationParams = {
  page: 0,
  limit: 10,
};

export type ViewType = 'view' | 'archive' | 'fork' | 'delete' | 'publish' | 'edit';

function PreviewScriptModalInner({
  script,
  onEdit,
  onArchive,
  onPublish,
  onRemove,
  onFork,
  getScriptVersionsDataSourceFactory,
}: PreviewScriptModalProps) {
  const { t } = useTranslation('scripts');
  const modal = useModal();
  const [selectedVersion, setSelectedVersion] = useState<ScriptVersionDto | null>(null);
  const [selectedView, setSelectedView] = useState<ViewType>('view');
  const [searchParams, setSearchParams] = useState<PaginationParams>(defaultScriptVersionSearchParams);

  const scriptVersionsDatasource = useMemo(() => {
    if (!script || !getScriptVersionsDataSourceFactory) return null;
    return getScriptVersionsDataSourceFactory(script.id, {
      page: searchParams.page,
      limit: searchParams.limit,
      sort: { field: 'updatedAt', order: 'desc' },
    });
  }, [getScriptVersionsDataSourceFactory, script, searchParams]);

  const { data: scriptVersions, invalidate: invalidateScriptVersion } = useDataSourceHook(scriptVersionsDatasource);

  const handleChangePage = useCallback(
    (_event: unknown, newPage: number) => {
      setSearchParams((prev) => ({ ...prev, page: newPage }));
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setSearchParams({ page: 0, limit: newRowsPerPage });
    },
    []
  );

  const handleSelectView = useCallback(
    (_event: React.MouseEvent<HTMLElement>, value: ViewType | null) => {
      if (value != null) {
        setSelectedView(value);
      }
    },
    []
  );

  const handleBack = useCallback(() => {
    setSelectedVersion(null);
    setSelectedView('view');
  }, []);

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

  const handleEdit = useCallback(
    (version: ScriptVersionDto) => {
      onEdit(version);
      modal.remove();
    },
    [modal, onEdit]
  );

  return (
    <Dialog
      open
      onClose={modal.remove}
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
        <Stack direction="row" gap={2} height="100%" width="100%">
          {!selectedVersion && (
            <ScriptVersionListPanel
              scriptVersions={scriptVersions}
              searchParams={searchParams}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              onSelectVersion={setSelectedVersion}
              totalItems={scriptVersions?.metadata.totalItems ?? 0}
            />
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
              <VersionActionToolbar
                selectedView={selectedView}
                onSelectView={handleSelectView}
                onBack={handleBack}
                scriptVersion={selectedVersion}
              />
              <Divider />
              <VersionDetailPanel
                selectedView={selectedView}
                selectedVersion={selectedVersion}
                headers={{
                  publish: t('modal.preview.publish.title'),
                  fork: t('modal.preview.fork.title'),
                  edit: t('modal.preview.edit.title'),
                  archive: t('modal.preview.archive.title'),
                  delete: t('modal.preview.delete.title'),
                }}
                infos={{
                  publish: t('modal.preview.publish.info'),
                  fork: t('modal.preview.fork.info'),
                  edit: t('modal.preview.edit.info'),
                  archive: t('modal.preview.archive.info'),
                  delete: t('modal.preview.delete.info'),
                }}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onPublish={handlePublish}
                onRemove={handleRemove}
                onFork={handleFork}
                labels={{
                  publish: {
                    confirm: t('modal.preview.publish.confirm'),
                    name: t('modal.preview.publish.name'),
                    validation: {
                      required: t('modal.preview.publish.validation.required'),
                      minLength: (num: number) => t('modal.preview.publish.validation.minLength', { num }),
                      maxLength: (num: number) => t('modal.preview.publish.validation.maxLength', { num }),
                    },
                  },
                  fork: {
                    confirm: t('modal.preview.fork.confirm'),
                  },
                  edit: {
                    confirm: t('modal.preview.edit.confirm'),
                  },
                  archive: {
                    confirm: t('modal.preview.archive.confirm'),
                  },
                  delete: {
                    confirm: t('modal.preview.delete.confirm'),
                  },
                }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export const PreviewScriptModal = NiceModal.create(PreviewScriptModalInner);

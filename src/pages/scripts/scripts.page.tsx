
import { useTranslation } from 'react-i18next';
import { AppBar, Button, Stack, Typography } from '@mui/material';
import { type PaginationParams, ScriptsList } from '../../components/lists/scripts/scripts.list';
import { ConfirmModal } from '../../components/modals/confirm.modal';
import { type ScriptSearchParams, ScriptsSearchBar } from '../../components/searchbars/scripts.searchbar';
import { useMemo } from 'react';
import { useContext, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import type { ScriptDto } from '../../api/queries/script.provider';
import { Add } from '@mui/icons-material';
import { CreateScriptModal } from '../../components/modals/create-script.modal';
import type { CreateScriptDto } from '../../api/commands/script/create.script.provider';
import { useNavigate } from 'react-router';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { useDebounce } from 'use-debounce';
import { PreviewScriptModal } from 'lam-frontend/components/modals/preview-script.modal';

const defaultSearchParams: ScriptSearchParams & PaginationParams = {
  page: 0,
  limit: 10,
  filter: {
    name: '',
  },
  sort: {
    field: 'name',
    order: 'asc',
  },
};

export function ScriptsPage() {
  const { t } = useTranslation('scripts');
  const {
    script: { getAll, remove, create },
    scriptVersion: { archive, publish, fork, remove: removeVersion },
  } = useContext(ApiProvider)!;
  const navigate = useNavigate();

  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [previewScript, setPreviewScript] = useState<ScriptDto | null>(null);

  const [selectedScript, setSelectedScript] = useState<ScriptDto | null>(null);
  const [searchParams, setSearchParams] = useState<ScriptSearchParams & PaginationParams>(defaultSearchParams);
  const [debouncedName] = useDebounce(searchParams.filter?.name, 300);

  const getAddScriptsDataSource = useMemo(
    () => getAll({ ...searchParams, filter: { ...searchParams, name: debouncedName } }),
    [getAll, searchParams, debouncedName]
  );
  const {
    data: scripts,
    isLoading: isScriptsLoading,
    invalidate: invalidateScript,
  } = useDataSourceHook(getAddScriptsDataSource);

  const handleRemove = (script: ScriptDto) => {
    setSelectedScript(script);
    setOpenRemoveConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedScript) return;

    await remove(selectedScript.id);
    setOpenRemoveConfirmModal(false);
    setSelectedScript(null);
    invalidateScript();
  };

  const handleCancelRemove = () => {
    setOpenRemoveConfirmModal(false);
    setSelectedScript(null);
  };

  const handleSearchParamsChanged = (params: ScriptSearchParams | PaginationParams) => {
    setSearchParams({
      ...searchParams,
      ...params,
    });
  };

  const handleCreateScript = async (data: CreateScriptDto) => {
    try {
      await create(data);
    } finally {
      setOpenCreateModal(false);
      invalidateScript();
    }
  };

  return (
    <Stack height="100%" sx={{ overflowX: 'hidden' }}>
      <AppBar
        position="relative"
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="h4">{t('header')}</Typography>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={() => setOpenCreateModal(true)}
          >
            <Add />
          </Button>
          <ScriptsSearchBar
            searchParams={searchParams}
            onSearchParamsChanged={handleSearchParamsChanged}
          />
        </Stack>
      </AppBar>
      <ScriptsList
        onScriptEditClick={(data, lastVersion) => {
            if(lastVersion) {
                navigate(`/scripts/${data.id}?version=${lastVersion.id}`)
            } else {
                navigate(`/scripts/${data.id}`)
            }
        }}
        onScriptPreviewClick={(data) => setPreviewScript(data)}
        onScriptDeleteClick={handleRemove}
        onPaginationParamsChange={handleSearchParamsChanged}
        searchParams={searchParams}
        scripts={scripts}
        isLoading={isScriptsLoading}
      />
      <CreateScriptModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreateScript}
      />
      <PreviewScriptModal
        open={!!previewScript}
        onClose={() => setPreviewScript(null)}
        script={previewScript!}
        onRemove={(scriptVersion) => removeVersion(previewScript!.id, scriptVersion.id)}
        onEdit={(scriptVersion) => navigate(`/scripts/${previewScript!.id}?version=${scriptVersion.id}`)}
        onFork={(scriptVersion) => fork(previewScript!.id, scriptVersion.id)}
        onArchive={(scriptVersion) => archive(previewScript!.id, scriptVersion.id)}
        onPublish={(scriptVersion, data) => publish(previewScript!.id, scriptVersion.id, data)}
      />
      <ConfirmModal
        open={openRemoveConfirmModal}
        title={t('confirm.delete.title')}
        content={t('confirm.delete.content')}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        confirmButtonText={t('confirm.delete.confirm')}
        cancelButtonText={t('confirm.delete.cancel')}
        confirmButtonColor="error"
      />
    </Stack>
  );
}

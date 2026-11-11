import { useTranslation } from 'react-i18next';
import { AppBar, Button, Stack, Typography } from '@mui/material';
import { type PaginationParams, ScriptsList } from '../../components/lists/scripts/scripts.list';
import { type ScriptSearchParams, ScriptsSearchBar } from '../../components/searchbars/scripts.searchbar';
import { useMemo, useCallback } from 'react';
import { useContext, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import type { ScriptDto } from '../../api/queries/script.provider';
import type { ScriptVersionDto } from '../../api/queries/script-version.provider';
import { Add } from '@mui/icons-material';
import type { CreateScriptDto } from '../../api/commands/script/create.script.provider';
import { useNavigate } from 'react-router';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { useDebounce } from 'use-debounce';
import { MODAL_IDS, showModal } from 'lam-frontend/components/modals/modal.definitions';

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
    scriptVersion: { archive, publish, fork, remove: removeVersion, getAll: getAllScriptVersions },
  } = useContext(ApiProvider)!;
  const navigate = useNavigate();

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
    showModal(MODAL_IDS.CONFIRM, {
      title: t('confirm.delete.title'),
      content: t('confirm.delete.content'),
      confirmButtonText: t('confirm.delete.confirm'),
      cancelButtonText: t('confirm.delete.cancel'),
      confirmButtonColor: 'error',
      onConfirm: async () => {
        await remove(script.id);
        invalidateScript();
      },
    });
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
      invalidateScript();
    }
  };

  const handlePreviewScript = useCallback(
    (data: ScriptDto) => {
      showModal(MODAL_IDS.PREVIEW_SCRIPT, {
        script: data,
        onRemove: async (scriptVersion: ScriptVersionDto) => {
          await removeVersion(data.id, scriptVersion.id);
        },
        onEdit: (scriptVersion: ScriptVersionDto) => {
          navigate(`/scripts/${data.id}?version=${scriptVersion.id}`);
        },
        onFork: (scriptVersion: ScriptVersionDto) => fork(data.id, scriptVersion.id),
        onArchive: (scriptVersion: ScriptVersionDto) => archive(data.id, scriptVersion.id),
        onPublish: (scriptVersion: ScriptVersionDto, versionData: { name: string }) =>
          publish(data.id, scriptVersion.id, versionData),
        getScriptVersionsDataSourceFactory: (scriptId, params) => getAllScriptVersions(scriptId, params ?? {}),
      });
    },
    [navigate, removeVersion, fork, archive, publish, getAllScriptVersions]
  );

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
            onClick={() => showModal(MODAL_IDS.CREATE_SCRIPT, { onCreate: handleCreateScript })}
          >
            <Add />
          </Button>
          <ScriptsSearchBar searchParams={searchParams} onSearchParamsChanged={handleSearchParamsChanged} />
        </Stack>
      </AppBar>
      <ScriptsList
        onScriptEditClick={(data, lastVersion) => {
          if (lastVersion) {
            navigate(`/scripts/${data.id}?version=${lastVersion.id}`);
          } else {
            navigate(`/scripts/${data.id}`);
          }
        }}
        onScriptPreviewClick={handlePreviewScript}
        onScriptDeleteClick={handleRemove}
        onPaginationParamsChange={handleSearchParamsChanged}
        searchParams={searchParams}
        scripts={scripts}
        isLoading={isScriptsLoading}
      />
    </Stack>
  );
}

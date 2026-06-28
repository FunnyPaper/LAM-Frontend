import { AppBar, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useMemo, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { Add } from '@mui/icons-material';
import { type PaginationParams, ScriptRunsList } from '../../components/lists/script-runs/script-runs.list';
import { type ScriptRunSearchParams, ScriptRunsSearchBar } from '../../components/searchbars/script-runs.searchbar';
import type { ScriptRunDto } from '../../api/queries/script-run.provider.dto';
import type { CreateScriptRunDto } from '../../api/commands/script-run/create.script-run.provider';
import type { EnvDto } from '../../api/queries/env.provider';
import type { ScriptDto } from '../../api/queries/script.provider';
import type { Paginated } from '../../api/queries/paginated.provider';
import type { DataSource } from '../../api/resources/datasource';
import type { ScriptVersionDto, GetScriptVersionsProviderParams } from '../../api/queries/script-version.provider';
import { useNavigate } from 'react-router';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { MODAL_IDS, showModal } from 'lam-frontend/components/modals/modal.definitions';

const defaultSearchParams: ScriptRunSearchParams & NoInfer<PaginationParams> = {
  page: 0,
  limit: 10,
  filter: {
    status: '',
  },
  sort: {
    field: 'createdAt',
    order: 'desc',
  },
};

export function RunsPage() {
  const { t } = useTranslation('runs');
  const {
    scriptRun: { getAll, remove, create, cancel },
    env: { getAll: getAllEnvs },
    script: { getAll: getAllScripts },
    scriptVersion: { getAll: getAllScriptVersions },
  } = useContext(ApiProvider)!;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState<ScriptRunSearchParams & NoInfer<PaginationParams>>(
    defaultSearchParams
  );

  const scriptRunResource = useMemo(() => getAll(searchParams), [getAll, searchParams]);
  const {
    data: scriptRunData,
    isLoading: isScriptRunLoading,
    invalidate: invalidateScriptRun,
  } = useDataSourceHook(scriptRunResource);

  // Datasources for CreateScriptRunModal
  const [envsPagination, setEnvsPagination] = useState<{ page: number; limit: number }>({ page: 0, limit: 10 });
  const [scriptsPagination, setScriptsPagination] = useState<{ page: number; limit: number }>({ page: 0, limit: 10 });
  const [scriptVersionsPagination, setScriptVersionsPagination] = useState<{
    page?: number;
    limit?: number;
    filter?: Record<string, unknown>;
    sort?: Record<string, unknown>;
  }>({ page: 0, limit: 10 });

  const getAllEnvsDataSource = useMemo<DataSource<Paginated<EnvDto>> | null>(
    () => getAllEnvs(envsPagination),
    [getAllEnvs, envsPagination]
  );

  const getAllScriptsDataSource = useMemo<DataSource<Paginated<ScriptDto>> | null>(
    () => getAllScripts(scriptsPagination),
    [getAllScripts, scriptsPagination]
  );

  const getScriptVersionsDataSourceFactory = useMemo<
    ((scriptId: string, params?: GetScriptVersionsProviderParams) => DataSource<Paginated<ScriptVersionDto>>) | null
  >(
    () =>
      getAllScriptVersions
        ? (scriptId, params) => getAllScriptVersions(scriptId, params ?? {})
        : null,
    [getAllScriptVersions]
  );

  const handleRemove = (scriptRun: ScriptRunDto) => {
    showModal(MODAL_IDS.CONFIRM, {
      title: t('confirm.delete.title'),
      content: t('confirm.delete.content'),
      confirmButtonText: t('confirm.delete.confirm'),
      cancelButtonText: t('confirm.delete.cancel'),
      confirmButtonColor: 'error',
      onConfirm: async () => {
        await remove(scriptRun.id);
        invalidateScriptRun();
      },
    });
  };

  const handleCancel = async (scriptRun: ScriptRunDto) => {
    await cancel(scriptRun.id);
    invalidateScriptRun();
  };

  const handleSearchParamsChanged = (params: Partial<ScriptRunSearchParams> | PaginationParams) =>
    setSearchParams({
      ...searchParams,
      ...params,
    });

  const handleCreateScriptRun = async (data: CreateScriptRunDto) => {
    try {
      await create(data);
    } finally {
      invalidateScriptRun();
    }
  };

  return (
    <Stack height="100%">
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
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={() =>
              showModal(MODAL_IDS.CREATE_SCRIPT_RUN, {
                onCreate: handleCreateScriptRun,
                getAllEnvsDataSource: getAllEnvsDataSource,
                getAllScriptsDataSource: getAllScriptsDataSource,
                getScriptVersionsDataSourceFactory: getScriptVersionsDataSourceFactory,
              })
            }
          >
            <Add />
          </Button>
          <ScriptRunsSearchBar
            searchParams={searchParams}
            onSearchParamsChanged={handleSearchParamsChanged}
          />
        </Stack>
      </AppBar>
      <ScriptRunsList
        onScriptRunEditClick={(data) => navigate(`/runs/${data.id}`)}
        onScriptRunDeleteClick={handleRemove}
        onScriptRunCancelClick={handleCancel}
        onPaginationParamsChange={handleSearchParamsChanged}
        searchParams={searchParams}
        scriptRuns={scriptRunData}
        isLoading={isScriptRunLoading}
      />
    </Stack>
  );
}
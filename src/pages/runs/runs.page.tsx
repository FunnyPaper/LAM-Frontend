import { AppBar, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useMemo, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { Add } from '@mui/icons-material';
import { type PaginationParams, ScriptRunsList } from '../../components/lists/script-runs/script-runs.list';
import { ConfirmModal } from '../../components/modals/confirm.modal';
import { type ScriptRunSearchParams, ScriptRunsSearchBar } from '../../components/searchbars/script-runs.searchbar';
import { CreateScriptRunModal } from '../../components/modals/create-script-run.modal';
import type { ScriptRunDto } from '../../api/queries/script-run.provider.dto';
import type { CreateScriptRunDto } from '../../api/commands/script-run/create.script-run.provider';
import { useNavigate } from 'react-router';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';

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
  } = useContext(ApiProvider)!;
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] = useState(false);
  const [selectedScriptRun, setSelectedScriptRun] = useState<ScriptRunDto | null>(null);
  const [searchParams, setSearchParams] = useState<ScriptRunSearchParams & NoInfer<PaginationParams>>(
    defaultSearchParams
  );

  const scriptRunResource = useMemo(() => getAll(searchParams), [getAll, searchParams]);
  const {
    data: scriptRunData,
    isLoading: isScriptRunLoading,
    invalidate: invalidateScriptRun,
  } = useDataSourceHook(scriptRunResource);

  const handleRemove = (scriptRun: ScriptRunDto) => {
    setSelectedScriptRun(scriptRun);
    setOpenRemoveConfirmModal(true);
  };

  const handleCancel = async (scriptRun: ScriptRunDto) => {
    await cancel(scriptRun.id);
    invalidateScriptRun();
  };

  const handleConfirmRemove = async () => {
    if (!selectedScriptRun) return;
    await remove(selectedScriptRun.id);

    setOpenRemoveConfirmModal(false);
    setSelectedScriptRun(null);
    invalidateScriptRun();
  };

  const handleCancelRemove = () => {
    setOpenRemoveConfirmModal(false);
    setSelectedScriptRun(null);
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
      setOpenCreateModal(false);
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
            onClick={() => setOpenCreateModal(true)}
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
      <CreateScriptRunModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreateScriptRun}
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

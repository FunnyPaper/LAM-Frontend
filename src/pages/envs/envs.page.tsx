import { AppBar, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EnvDrawer } from '../../components/drawers/env.drawer';
import { type PaginationParams, EnvsList } from '../../components/lists/envs/envs.list';
import { CreateEnvModal } from '../../components/modals/create-env.modal';
import { ConfirmModal } from '../../components/modals/confirm.modal';
import { type EnvSearchParams, EnvsSearchBar } from '../../components/searchbars/envs.searchbar';
import { useContext, useMemo, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import type { EnvDto } from '../../api/queries/env.provider';
import { Add } from '@mui/icons-material';
import type { CreateEnvDto } from 'lam-frontend/api/commands/env/create.env.provider';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { useDebounce } from 'use-debounce';

const defaultSearchParams: EnvSearchParams & PaginationParams = {
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

export function EnvsPage() {
  const { t } = useTranslation('envs');
  const {
    env: { getAll, remove, update, create },
  } = useContext(ApiProvider)!;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<EnvDto | null>(null);
  const [searchParams, setSearchParams] = useState<EnvSearchParams & PaginationParams>(defaultSearchParams);
  const [debouncedName] = useDebounce(searchParams.filter?.name, 300);

  const getAllDataSource = useMemo(
    () => getAll({ ...searchParams, filter: { ...searchParams?.filter, name: debouncedName } }),
    [getAll, searchParams, debouncedName]
  );

  const { data: envs, isLoading: isEnvsLoading, invalidate: invalidateEnv } = useDataSourceHook(getAllDataSource);

  const handleRemove = (env: EnvDto) => {
    setSelectedEnv(env);
    setOpenConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedEnv) return;
    await remove(selectedEnv.id);
    setOpenEditDrawer(false);
    setOpenConfirmModal(false);
    setSelectedEnv(null);
    invalidateEnv();
  };

  const handleCancelRemove = () => {
    setSelectedEnv(null);
    setOpenEditDrawer(false);
  };

  const handleParamsChange = (params: EnvSearchParams | PaginationParams) => {
    setSearchParams({
      ...searchParams,
      ...params,
    });
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
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={() => setOpenCreateModal(true)}
          >
            <Add />
          </Button>
          <EnvsSearchBar
            searchParams={searchParams}
            onSearchParamsChanged={handleParamsChange}
          />
        </Stack>
      </AppBar>
      {selectedEnv && (
        <EnvDrawer<CreateEnvDto>
          open={openEditDrawer}
          env={selectedEnv}
          onSubmit={(data) => {
            update(selectedEnv.id, data);
            setOpenEditDrawer(false);
            invalidateEnv();
          }}
          onRemove={handleRemove}
          onClose={() => setOpenEditDrawer(false)}
        />
      )}
      <EnvsList
        onEnvEditClick={(data) => {
          setSelectedEnv(data);
          setOpenEditDrawer(true);
        }}
        onEnvDeleteClick={handleRemove}
        onPaginationParamsChange={handleParamsChange}
        searchParams={searchParams}
        envs={envs}
        isLoading={isEnvsLoading}
      />
      <CreateEnvModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={async (data) => {
          await create(data);
          setOpenCreateModal(false);
          invalidateEnv();
        }}
      />
      <ConfirmModal
        open={openConfirmModal}
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

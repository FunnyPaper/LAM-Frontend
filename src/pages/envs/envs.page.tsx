import { AppBar, Box, Button, Stack, Typography } from '@mui/material';
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
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] = useState(false);
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
    setOpenRemoveConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedEnv) return;
    await remove(selectedEnv.id);
    setOpenRemoveConfirmModal(false);
    setOpenEditDrawer(false);
    setSelectedEnv(null);
    invalidateEnv();
  };

  const handleCancelRemove = () => {
    setOpenRemoveConfirmModal(false);
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
          <EnvsSearchBar
            onSearch={() => setSearchParams(searchParams)}
            searchParams={searchParams}
            onSearchParamsChanged={handleParamsChange}
          />
        </Stack>
      </AppBar>
      <Box p={2} height="100%">
        {selectedEnv && (
          <EnvDrawer<CreateEnvDto>
            open={openEditDrawer}
            env={selectedEnv}
            onSubmit={(data) => {
              update(selectedEnv.id, data);
              invalidateEnv();
            }}
            onRemove={handleRemove}
            onClose={() => setOpenEditDrawer(false)}
          />
        )}
        <Box component="div" height="100%">
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
            onCreate={(data) => {
              create(data);
              invalidateEnv();
            }}
          />
        </Box>
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
      </Box>
    </Stack>
  );
}

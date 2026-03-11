import {
  AppBar,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditEnvDrawer from '../../components/drawers/edit-env.drawer';
import EnvsList from '../../components/lists/envs/envs.list';
import CreateEnvModal from '../../components/modals/create-env.modal';
import { Suspense, useContext, useState } from 'react';
import { ApiProvider } from '../../api/api.provider';
import type { EnvDto } from '../../api/queries/env.provider';
import { Add } from '@mui/icons-material';
import EnvsFilter from '../../components/filters/envs.filter';

export default function EnvsPage() {
  const { t } = useTranslation('envs');
  const { removeEnv, updateEnv, createEnv } = useContext(ApiProvider);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<EnvDto>();

  return (
    <Stack height="100%">
      <AppBar position="relative" sx={{ p: 2 }}>
        <Stack direction="row" gap={2}>
          <Typography variant="h4">{t('header')}</Typography>
          <Button
            size="small"
            variant="contained"
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={() => setOpenCreateModal(true)}
          >
            <Add />
          </Button>
          <EnvsFilter />
        </Stack>
      </AppBar>
      <Box p={2} height="100%">
        {selectedEnv && (
          <EditEnvDrawer
            open={openEditDrawer}
            env={selectedEnv}
            onSubmit={updateEnv}
            onRemove={(data) => {
              removeEnv(data.id);
              setOpenEditDrawer(false);
            }}
            onClose={() => setOpenEditDrawer(false)}
          />
        )}
        <Box component="div" height="100%">
          <Suspense fallback={<Skeleton />}>
            <EnvsList
              onButtonCreateClick={() => setOpenCreateModal(true)}
              onEnvEditClick={(data) => {
                setSelectedEnv(data);
                setOpenEditDrawer(true);
              }}
            />
          </Suspense>

          <CreateEnvModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={createEnv}
          />
        </Box>
      </Box>
    </Stack>
  );
}

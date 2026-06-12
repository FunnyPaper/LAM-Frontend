import { Delete } from '@mui/icons-material';
import { Button, Drawer, Paper, Stack, Typography } from '@mui/material';
import { EnvForm } from '../forms/env.form';
import type { EnvDto } from '../../api/queries/env.provider';
import { useTranslation } from 'react-i18next';
import type { CreateEnvDto } from 'lam-frontend/api/commands/env/create.env.provider';

export type EnvDrawerProps<T> = {
  open: boolean;
  env: EnvDto | null;
  onSubmit: (data: T) => void;
  onRemove: (data: EnvDto) => void;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLElement | null>;
};

export function EnvDrawer<T extends CreateEnvDto | Partial<CreateEnvDto>>({
  open,
  env,
  onSubmit,
  onRemove,
  onClose,
  containerRef,
}: EnvDrawerProps<T>) {
  const { t } = useTranslation('envs');

  if (!env) return null;

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      container={containerRef?.current}
      sx={{
        '&.MuiDrawer-modal': {
          position: 'initial'
        },
        '& .MuiDrawer-paper': {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'auto',
        },
      }}
    >
      <Stack gap={2} p={2} maxWidth={400}>
        <Paper elevation={3} sx={{ px: 2, py: 1 }}>
          <Stack direction="row" gap={2} alignItems="center" width="100%">
            <Typography noWrap={false} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} flex={1} variant="body1">
              {env.name}
            </Typography>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => onRemove(env)}>
              {t('drawer.remove')}
            </Button>
          </Stack>
        </Paper>
        <EnvForm<T> defaultValues={env} onSubmit={onSubmit} />
      </Stack>
    </Drawer>
  );
}

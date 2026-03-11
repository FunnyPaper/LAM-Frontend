import { Remove } from '@mui/icons-material';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import EnvForm from '../forms/env.form';
import type { EnvDto } from '../../api/queries/env.provider';
import { useTranslation } from 'react-i18next';
import type { UpdateEnvDto } from '../../api/commands/env/update.env.provider';

export type EditEnvDrawerProps = {
  open: boolean;
  env: EnvDto;
  onSubmit: (data: UpdateEnvDto) => void;
  onRemove: (data: EnvDto) => void;
  onClose: () => void;
};

export default function EditEnvDrawer({
  open,
  env,
  onSubmit,
  onRemove,
  onClose,
}: EditEnvDrawerProps) {
  const { t } = useTranslation('envs');

  return (
    <Drawer variant="temporary" anchor="right" open={open} onClose={onClose}>
      <Stack gap={2} p={2} maxWidth={400}>
        <Stack direction="row" gap={2} alignItems="center" width="100%">
          <Typography
            noWrap={false}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            flex={1}
            variant="body1"
          >
            {env.name}
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<Remove />}
            onClick={() => onRemove(env)}
          >
            {t('drawer.remove')}
          </Button>
        </Stack>
        <EnvForm defaultValues={env} onSubmit={onSubmit} />
      </Stack>
    </Drawer>
  );
}

import { AppBar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Delete, Stop, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ScriptRunStatus } from 'lam-frontend/api/queries/script-run.provider.dto';
import { getRunStatusColor } from 'lam-frontend/utils/colors';

export type RunDetailsAppBarProps = {
  currentStatus: ScriptRunStatus;
  isRunning: boolean;
  isFinished: boolean;
  onBackToList: () => void;
  onStop: () => void;
  onRemove: () => void;
};

export function RunDetailsAppBar({
  currentStatus,
  isRunning,
  isFinished,
  onBackToList,
  onStop,
  onRemove,
}: RunDetailsAppBarProps) {
  const { t } = useTranslation('runs');

  return (
    <AppBar
      position="relative"
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Button
          size="small"
          variant="outlined"
          sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
          onClick={onBackToList}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h4">{t('details.header')}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={t(`status.${currentStatus.toLowerCase()}`)}
            size="small"
            variant="outlined"
            color={getRunStatusColor(currentStatus)}
          />
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        {isRunning && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Stop />}
            onClick={onStop}
            disabled={currentStatus === 'Cancelling'}
          >
            {t('details.stop')}
          </Button>
        )}
        {isFinished && (
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={onRemove}>
            {t('details.remove')}
          </Button>
        )}
      </Stack>
    </AppBar>
  );
}

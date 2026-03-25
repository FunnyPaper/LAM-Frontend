import { Card, CardHeader, IconButton, Stack, Typography, Chip } from '@mui/material';
import type { ScriptRunDto } from '../../../api/queries/script-run.provider.dto';
import { Delete, Stop, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { getStatusColor } from 'lam-frontend/utils/colors';

export type ScriptRunsListItemProps = {
  scriptRun: ScriptRunDto;
  onEdit: (data: ScriptRunDto) => void;
  onCancel: (data: ScriptRunDto) => void;
  onDelete: (data: ScriptRunDto) => void;
};

export function ScriptRunsListItem({ scriptRun, onEdit, onDelete, onCancel }: ScriptRunsListItemProps) {
  const { t } = useTranslation('runs');

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row">
            <IconButton onClick={() => onEdit(scriptRun)}>
              <Visibility />
            </IconButton>
            {scriptRun.status == 'Running' || scriptRun.status == 'Queued' ? (
              <IconButton onClick={() => onCancel(scriptRun)}>
                <Stop />
              </IconButton>
            ) : (
              <IconButton onClick={() => onDelete(scriptRun)}>
                <Delete />
              </IconButton>
            )}
          </Stack>
        }
        title={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Typography noWrap={false} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scriptRun.id}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              {scriptRun.envSnapshot?.name && (
                <Chip label={scriptRun.envSnapshot.name} size="small" variant="outlined" />
              )}
              <Chip
                label={t(`status.${scriptRun.status.toLowerCase()}`)}
                size="small"
                variant="outlined"
                color={getStatusColor(scriptRun.status)}
              />
              {scriptRun.createdAt && (
                <Chip
                  label={`${t('createdAt')}: ${format(new Date(scriptRun.createdAt), 'yyyy-MM-dd HH:mm')}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {scriptRun.finishedAt && (
                <Chip
                  label={`${t('finishedAt')}: ${format(new Date(scriptRun.finishedAt), 'yyyy-MM-dd HH:mm')}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>
        }
        sx={{
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            display: 'grid',
          },
        }}
      />
    </Card>
  );
}

import { Card, CardHeader, CardContent, Stack, Box, Typography } from '@mui/material';
import { formatLongDate } from 'lam-frontend/utils/date';
import type { ScriptRunDto } from 'lam-frontend/api/queries/script-run.provider.dto';

export type ScriptRunGeneralInfoProps = {
  isMobile: boolean;
  scriptRunData: ScriptRunDto;
  labels: {
    generalInfo: string;
    id: string;
    environment: string;
    createdAt: string;
    updatedAt: string;
    finishedAt: string;
  };
};

export function ScriptRunGeneralInfoPanel({ isMobile, scriptRunData, labels }: ScriptRunGeneralInfoProps) {
  return (
    <Card>
      <CardHeader title={labels.generalInfo} />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.id}
              </Typography>
              <Typography>{scriptRunData.id}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.environment}
              </Typography>
              <Typography>{scriptRunData.envSnapshot?.name || 'N/A'}</Typography>
            </Box>
          </Stack>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.createdAt}
              </Typography>
              <Typography>
                {scriptRunData.createdAt ? formatLongDate(scriptRunData.createdAt) : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.updatedAt}
              </Typography>
              <Typography>
                {scriptRunData.updatedAt ? formatLongDate(scriptRunData.updatedAt) : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.finishedAt}
              </Typography>
              <Typography>
                {scriptRunData.finishedAt ? formatLongDate(scriptRunData.finishedAt) : '-'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

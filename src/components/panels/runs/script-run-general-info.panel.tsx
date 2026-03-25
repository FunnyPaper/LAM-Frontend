import { Card, CardHeader, CardContent, Stack, Box, Typography } from '@mui/material';
import { format } from 'date-fns';
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
                {scriptRunData.createdAt ? format(new Date(scriptRunData.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.updatedAt}
              </Typography>
              <Typography>
                {scriptRunData.updatedAt ? format(new Date(scriptRunData.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.finishedAt}
              </Typography>
              <Typography>
                {scriptRunData.finishedAt ? format(new Date(scriptRunData.finishedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

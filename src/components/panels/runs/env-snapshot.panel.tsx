import { Card, CardHeader, CardContent, Stack, Box, Typography } from '@mui/material';
import type { ScriptRunDto } from 'lam-frontend/api/queries/script-run.provider.dto';

type EnvsSnapshotPanelProps = {
  scriptRunData: ScriptRunDto;
  labels: {
    envSnapshot: string;
    cachedData: string;
    name: string;
    data: string;
  };
};

export function EnvsSnapshotPanel({ scriptRunData, labels }: EnvsSnapshotPanelProps) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title={labels.envSnapshot} subheader={labels.cachedData} />
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {labels.name}
            </Typography>
            <Typography>{scriptRunData.envSnapshot?.name || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {labels.data}
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                p: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              {JSON.stringify(scriptRunData.envSnapshot?.data, null, 2) || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

import { Card, CardHeader, CardContent, Stack, Box, Typography } from '@mui/material';
import type { ScriptRunDto } from 'lam-frontend/api/queries/script-run.provider.dto';
import type { ScriptVersionStatus } from 'lam-frontend/api/queries/script-version.provider';

export type ScriptVersionSnapshotPanelProps = {
  isMobile: boolean;
  scriptRunData: ScriptRunDto;
  labels: {
    scriptVersionSnapshot: string;
    cachedData: string;
    versionNumber: string;
    status: string;
    content: string;
  } & Record<Lowercase<ScriptVersionStatus>, string>;
};

export function ScriptVersionSnapshotPanel({ isMobile, scriptRunData, labels }: ScriptVersionSnapshotPanelProps) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title={labels.scriptVersionSnapshot} subheader={labels.cachedData} />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.versionNumber}
              </Typography>
              <Typography>{scriptRunData.scriptVersionSnapshot?.versionNumber || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {labels.status}
              </Typography>
              <Typography>
                {
                  labels[
                    (
                      scriptRunData.scriptVersionSnapshot?.status || 'Unknown'
                    ).toLowerCase() as Lowercase<ScriptVersionStatus>
                  ]
                }
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {labels.content}
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
              {JSON.stringify(scriptRunData.scriptVersionSnapshot?.content, null, 2) || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

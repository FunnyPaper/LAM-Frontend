import { Download } from '@mui/icons-material';
import { Card, CardHeader, CardContent, Stack, Typography, Button, Box } from '@mui/material';
import type { ScriptRunResultDto } from 'lam-frontend/api/queries/script-run.provider.dto';
import { downloadFile } from 'lam-frontend/utils/download-file';

export type ResultsPanelProps = {
  runId: string;
  resultData?: ScriptRunResultDto;
  labels: {
    result: string;
    description: string;
    data: string;
    download: string;
    noResult: string;
  };
};

export function ResultsPanel({ runId, resultData = {}, labels }: ResultsPanelProps) {
  const handleDownload = () => {
    downloadFile(JSON.stringify(resultData, null, 2), `script-run-${runId}-result.json`);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title={labels.result} subheader={labels.description} />
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {labels.data}
          </Typography>
          <Button variant="outlined" startIcon={<Download />} onClick={handleDownload}>
            {labels.download}
          </Button>
        </Stack>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            height: 300,
            overflow: 'auto',
          }}
        >
          {resultData ? (
            <Typography variant="body2" component="pre">
              {JSON.stringify(resultData, null, 2)}
            </Typography>
          ) : (
            <Typography>{labels.noResult}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

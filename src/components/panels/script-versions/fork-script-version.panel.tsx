import { Button, Stack, Typography } from '@mui/material';
import type { ScriptVersionDto } from 'lam-frontend/api';

export type ForkScriptVersionPanelProps = {
  header: string;
  info: string;
  scriptVersion: ScriptVersionDto;
  labels: {
    confirm: string;
  };
  onFork: (version: ScriptVersionDto) => void;
};

export function ForkScriptVersionPanel({ header, info, scriptVersion, onFork, labels }: ForkScriptVersionPanelProps) {
  return (
    <Stack direction="column" gap={2} sx={{ px: 2, py: 1 }}>
      <Stack direction="column" flex={1}>
        <Typography variant="subtitle1" fontWeight={600}>{header}</Typography>
        <Typography variant="body2" flex={1} textAlign="justify">
          {info}
        </Typography>
      </Stack>
      <Button variant="outlined" onClick={() => onFork(scriptVersion)}>
        {labels.confirm}
      </Button>
    </Stack>
  );
}

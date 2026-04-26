import { Button, Stack, Typography } from '@mui/material';
import type { ScriptVersionDto } from 'lam-frontend/api';

export type ArchiveScriptVersionPanelProps = {
  header: string;
  info: string;
  scriptVersion: ScriptVersionDto;
  labels: {
    confirm: string;
  };
  onArchive: (version: ScriptVersionDto) => void;
};

export function ArchiveScriptVersionPanel({
  header,
  info,
  scriptVersion,
  onArchive,
  labels,
}: ArchiveScriptVersionPanelProps) {
  return (
    <Stack direction="column" gap={2} sx={{ px: 2, py: 1 }}>
      <Stack direction="column" flex={1}>
        <Typography variant="subtitle1" fontWeight={600}>{header}</Typography>
        <Typography variant="body2" flex={1} textAlign='justify'>
          {info}
        </Typography>
      </Stack>
      <Button variant="outlined" onClick={() => onArchive(scriptVersion)}>
        {labels.confirm}
      </Button>
    </Stack>
  );
}

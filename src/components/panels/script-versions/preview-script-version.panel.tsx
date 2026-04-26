import { Box } from '@mui/material';

export type PreviewScriptVersionPanelProps = {
  content: string;
};

export function PreviewScriptVersionPanel({ content }: PreviewScriptVersionPanelProps) {
  return (
    <Box
      component="pre"
      sx={(theme) => ({
        px: 2,
        py: 1,
        margin: 0,
        fontSize: 14,
        overflow: 'auto',
        minHeight: 0,
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
        },
      })}
    >
      {content}
    </Box>
  );
}

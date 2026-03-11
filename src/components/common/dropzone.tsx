import { Close, Delete, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

export type DropzoneProps<T> = {
  value?: T;
  onChange: (data?: T) => void;
  disabled?: boolean;
};

export default function Dropzone<T>({
  value,
  onChange,
  disabled,
}: DropzoneProps<T>) {
  const { t } = useTranslation('common');
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (file.type != 'application/json') {
        setError(t('components.dropzone.errors.onlyJson'));
        return;
      }

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        setFilename(file.name);
        setError(null);
        onChange(json);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t('components.dropzone.errors.invalidJson')
        );
      }
    },
    [onChange, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
    disabled,
  });

  const remove = () => {
    onChange(undefined);
    setFilename(null);
    setExpanded(false);
    setError(null);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-alowed' : 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            border: '2px solid',
          },
        }}
      >
        <input {...getInputProps()} />

        <Typography variant="body1">
          {t('components.dropzone.dragNDrop')}
        </Typography>

        <Typography variant="body2" color="text.secondry">
          {t('components.dropzone.clickToSelect')}
        </Typography>

        {filename && (
          <Divider textAlign="center" sx={{ mt: 1, mb: 1 }}>
            {filename}
          </Divider>
        )}

        {value && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin="auto"
            gap={1}
          >
            <Button
              variant="contained"
              size="small"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded((p) => !p);
              }}
              startIcon={<Visibility />}
            >
              {t('components.dropzone.preview')}
            </Button>
            <Button
              variant="contained"
              size="small"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove();
              }}
              startIcon={<Delete />}
            >
              {t('components.dropzone.remove')}
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={expanded} onClose={() => setExpanded(false)}>
        <DialogTitle sx={{ m: 0, p: 2 }}>{filename}</DialogTitle>
        <IconButton
          onClick={() => setExpanded(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Paper
            variant="outlined"
            component="pre"
            sx={{
              p: 2,
              maxHeight: 300,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
          >
            <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
          </Paper>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

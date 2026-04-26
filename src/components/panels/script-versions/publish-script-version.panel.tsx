import { SettingsBackupRestore } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material';
import type { ScriptVersionDto } from 'lam-frontend/api';
import { Controller, useForm, useWatch } from 'react-hook-form';

export type PublishScriptVersionPanelProps = {
  header: string;
  info: string;
  scriptVersion: ScriptVersionDto;
  labels: {
    confirm: string;
    name: string;
    validation: {
      required: string;
      minLength: (value: number) => string;
      maxLength: (value: number) => string;
    };
  };
  onPublish: (version: ScriptVersionDto, data: { name: string }) => void;
};

export function PublishScriptVersionPanel({
  header,
  info,
  scriptVersion,
  onPublish,
  labels,
}: PublishScriptVersionPanelProps) {
  const { control, handleSubmit, resetField } = useForm<{ name: string }>({
    defaultValues: { name: scriptVersion.name ?? '' },
  });
  const name = useWatch({ control, name: 'name' });

  return (
    <Stack direction="column" gap={2} sx={{ px: 2, py: 1 }}>
      <Stack direction="column">
        <Typography variant="subtitle1" fontWeight={600}>
          {header}
        </Typography>
        <Typography variant="body2" textAlign="justify">
          {info}
        </Typography>
      </Stack>
      <Stack
        component="form"
        flex={1}
        justifyContent="space-between"
        onSubmit={handleSubmit((data) => onPublish(scriptVersion, { name: data.name }))}
      >
        <Controller
          name="name"
          control={control}
          rules={{
            required: labels.validation.required,
            minLength: {
              value: 1,
              message: labels.validation.minLength(1),
            },
            maxLength: {
              value: 32,
              message: labels.validation.maxLength(32),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={labels.name}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              autoComplete="off"
              slotProps={{
                input: {
                  endAdornment: name != (scriptVersion.name ?? '') && (
                    <InputAdornment position="end">
                      <Tooltip title={'Restore'}>
                        <IconButton
                          size="small"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => resetField('name')}
                        >
                          <SettingsBackupRestore fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Button type="submit" variant="outlined">
          <Typography variant='button'>{labels.confirm}</Typography>
        </Button>
      </Stack>
    </Stack>
  );
}
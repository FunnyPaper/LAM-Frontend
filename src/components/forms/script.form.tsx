import { Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import type { CreateScriptDto } from '../../api/commands/script/create.script.provider';
import { Save } from '@mui/icons-material';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';

export type ScriptFormProps<T extends CreateScriptDto | UpdateScriptDto> = {
  script?: T;
  onSubmit: (data: ScriptFormData) => void;
};

export type ScriptFormData = {
  name: string;
  description: string;
};

export function ScriptForm<T extends CreateScriptDto | UpdateScriptDto>({ script, onSubmit }: ScriptFormProps<T>) {
  const { t } = useTranslation('scripts');
  const { control, handleSubmit } = useForm<ScriptFormData>({
    defaultValues: script ?? {
      name: '',
      description: '',
    },
  });

  return (
    <Stack gap={2} direction={'column'} component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <Controller
        name="name"
        control={control}
        rules={{
          required: t('modal.required', { field: t('modal.name') }),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label={t('modal.name')}
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth label={t('modal.description')} variant="outlined" multiline rows={4} />
        )}
      />

      <Stack direction="row" justifyContent="flex-end">
        <Button type="submit" variant="contained" startIcon={<Save />}>
          {t('modal.save')}
        </Button>
      </Stack>
    </Stack>
  );
}

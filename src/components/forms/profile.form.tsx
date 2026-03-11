import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ProfileDto } from '../../api/queries/profile.provider';
import { Save, SettingsBackupRestore } from '@mui/icons-material';
import { use } from 'react';

export type ProfileFormDto = {
  email: string;
};

export type ProfileFormProps = {
  defaultValues: Promise<ProfileDto>;
  onSubmit: (data: ProfileFormDto) => Promise<void>;
};

export default function ProfileForm({
  defaultValues,
  onSubmit,
}: ProfileFormProps) {
  const { t } = useTranslation('profile');
  const awaitedValues = use(defaultValues);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    reset,
    formState: { errors },
  } = useForm<ProfileFormDto>({ defaultValues: awaitedValues });

  const email = useWatch({ control, name: 'email' });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) =>
        onSubmit(data).catch(() =>
          setError('root', {
            type: 'server',
            message: t('form.validation.credentials'),
          })
        )
      )}
    >
      <Controller
        name="email"
        control={control}
        rules={{
          required: t('form.validation.required', { field: 'Email' }),
          pattern: {
            value: /^\S+@\S+$/i,
            message: t('form.validation.pattern.email'),
          },
        }}
        render={({ field, fieldState }) => (
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (errors.root) clearErrors('root');
              }}
              autoComplete="off"
              label={t('form.fields.email')}
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={{
                input: {
                  endAdornment: email != awaitedValues.email && (
                    <InputAdornment position="end">
                      <Tooltip title={t('form.tooltip.restore')}>
                        <IconButton
                          size="small"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => resetField('email')}
                        >
                          <SettingsBackupRestore fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        )}
      />

      {email != awaitedValues.email && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => reset()}
            onMouseDown={(e) => e.preventDefault()}
            startIcon={<SettingsBackupRestore />}
          >
            <Typography variant="button">{t('form.fields.reset')}</Typography>
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<Save />}
          >
            <Typography variant="button">{t('form.fields.update')}</Typography>
          </Button>
        </Stack>
      )}
    </Box>
  );
}

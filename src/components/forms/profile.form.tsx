import { Box, Button, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { UserDto } from '../../api/queries/user.provider';
import { Save, SettingsBackupRestore, Visibility, VisibilityOff } from '@mui/icons-material';
import { isStrongPassword } from 'class-validator';
import { useState } from 'react';

export type ProfileFormDto = {
  username: string;
  password: string;
};

export type ProfileFormProps = {
  defaultValues: UserDto;
  onSubmit: (data: ProfileFormDto) => Promise<void>;
};

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const { t } = useTranslation('profile');

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    reset,
    formState: { errors },
  } = useForm<ProfileFormDto>({ defaultValues: { ...defaultValues, password: '' } });

  const username = useWatch({ control, name: 'username' });
  const [showPassword, setShowPassword] = useState(false);

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
        name="username"
        control={control}
        rules={{
          required: t('form.validation.required', { field: 'Username' }),
          pattern: {
            value: /^[a-zA-Z0-9._-]+$/i,
            message: t('form.validation.pattern.username'),
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
              label={t('form.fields.username')}
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={{
                input: {
                  endAdornment: username != defaultValues.username && (
                    <InputAdornment position="end">
                      <Tooltip title={t('form.tooltip.restore')}>
                        <IconButton
                          size="small"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => resetField('username')}
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

      {username != defaultValues.username && (
        <>
          <Controller
            name="password"
            control={control}
            rules={{
              required: t('form.validation.required', { field: 'Password' }),
              minLength: {
                value: 6,
                message: t('form.validation.minLength', { length: 6 }),
              },
              validate: (value) =>
                isStrongPassword(value, {
                  minLength: 6,
                  minLowercase: 1,
                  minNumbers: 1,
                  minSymbols: 1,
                  minUppercase: 1,
                }) || t('form.validation.strongPassword'),
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="off"
                label={t('form.fields.password')}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={showPassword ? t('form.tooltip.hidePassword') : t('form.tooltip.showPassword')}>
                          <IconButton
                            size="small"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {!showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
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

            <Button type="submit" variant="contained" fullWidth startIcon={<Save />}>
              <Typography variant="button">{t('form.fields.update')}</Typography>
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

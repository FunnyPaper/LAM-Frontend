import { Alert, Box, Button, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { isStrongPassword } from 'class-validator';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Link as MuiLink } from '@mui/material';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

export type LoginFormDto = {
  username: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit: (data: LoginFormDto) => Promise<void>;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation('login');

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormDto>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

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
      sx={{ maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h5">{t('header')}</Typography>

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
            error={!!fieldState.error || !!errors.root}
            helperText={fieldState.error?.message}
          />
        )}
      />

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
            onChange={(e) => {
              field.onChange(e);
              if (errors.root) clearErrors('root');
            }}
            autoComplete="off"
            label={t('form.fields.password')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            error={!!fieldState.error || !!errors.root}
            helperText={fieldState.error?.message}
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

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} startIcon={<Login />}>
        <Typography variant="button">{t('form.fields.login')}</Typography>
      </Button>

      <MuiLink variant="caption" component={RouterLink} to="/register">
        {t('form.notSigned')}
      </MuiLink>
    </Box>
  );
}

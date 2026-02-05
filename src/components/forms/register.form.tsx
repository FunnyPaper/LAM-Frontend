import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { isStrongPassword } from 'class-validator';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Link as MuiLink } from '@mui/material';

export type RegisterFormDto = {
  email: string;
  password: string;
};

export type RegisterFormProps = {
  onSubmit: (data: RegisterFormDto) => Promise<void>;
};

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation('register');

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormDto>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
            error={!!fieldState.error || !!errors.root}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: t('form.validation.required', {
            field: 'Password',
          }),
          minLength: {
            value: 6,
            message: t('form.validation.minLength', { length: 6 }),
          },
          validate: (value) =>
            isStrongPassword(value) || 'Not a strong password',
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
            type="password"
            fullWidth
            margin="normal"
            error={!!fieldState.error || !!errors.root}
            helperText={fieldState.error?.message}
          />
        )}
      />

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        <Typography variant="button">{t('form.fields.login')}</Typography>
      </Button>

      <MuiLink variant="caption" component={RouterLink} to="/login">
        {t('form.signed')}
      </MuiLink>
    </Box>
  );
}

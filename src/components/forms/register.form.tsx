import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { isStrongPassword } from 'class-validator';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Link as MuiLink } from '@mui/material';
import { Create, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

export type RegisterFormDto = {
  email: string;
  password: string;
  confirmPassword: string;
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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormDto>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = useWatch({ control, name: 'password' });

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
            autoComplete="new-password"
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
                    <Tooltip
                      title={
                        showPassword
                          ? t('form.tooltip.hidePassword')
                          : t('form.tooltip.showPassword')
                      }
                    >
                      <IconButton
                        size="small"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: t('form.validation.confirmPassword', {
            field: 'Password',
          }),
          validate: (value) =>
            value === password || t('form.validation.strongPassword'),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            onChange={(e) => {
              field.onChange(e);
              if (errors.root) clearErrors('root');
            }}
            autoComplete="new-password"
            label={t('form.fields.confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            error={!!fieldState.error || !!errors.root}
            helperText={fieldState.error?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={
                        showPassword
                          ? t('form.tooltip.hidePassword')
                          : t('form.tooltip.showPassword')
                      }
                    >
                      <IconButton
                        size="small"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
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

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={{ mt: 2 }}
        startIcon={<Create />}
      >
        <Typography variant="button">{t('form.fields.login')}</Typography>
      </Button>

      <MuiLink variant="caption" component={RouterLink} to="/login">
        {t('form.signed')}
      </MuiLink>
    </Box>
  );
}

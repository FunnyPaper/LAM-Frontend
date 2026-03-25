import { Add, Delete, Save } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Controller, useFieldArray, useForm, type Control, type FieldPath } from 'react-hook-form';
import type { EnvDto } from '../../api/queries/env.provider';
import { useTranslation } from 'react-i18next';
import type { UpdateEnvDto } from '../../api/commands/env/update.env.provider';
import { Dropzone } from '../common/dropzone';
import { useCallback, type ReactNode } from 'react';
import type { CreateEnvDto } from 'lam-frontend/api/commands/env/create.env.provider';

export type EnvFormProps<T extends UpdateEnvDto | CreateEnvDto> = {
  defaultValues?: EnvDto;
  onSubmit: (data: T) => void;
};

type FieldRowData = {
  key: string | null;
  value?: string | null;
};

type EnvFormData = {
  id: string;
  name: string;
  description: string;
  fields: FieldRowData[];
  temporaryField: FieldRowData;
};

export function EnvForm<T extends UpdateEnvDto | CreateEnvDto>({ defaultValues, onSubmit }: EnvFormProps<T>) {
  const { t } = useTranslation('envs');

  const transformFields = useCallback(
    (data: Record<string, string | undefined>) =>
      Object.entries(data).map(([key, value]) => ({
        key,
        value,
      })),
    []
  );

  const transformedDefaultValues = defaultValues && {
    name: defaultValues.name,
    description: defaultValues.description,
    fields: transformFields(defaultValues.data || {}),
  };

  const { control, getValues, trigger, resetField, handleSubmit } = useForm<EnvFormData>({
    defaultValues: {
      name: '',
      description: '',
      temporaryField: { key: '', value: '' },
      ...transformedDefaultValues,
    },
    reValidateMode: 'onSubmit',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'fields',
  });

  const internalOnSubmit = (data: EnvFormData) => {
    const json = Object.fromEntries(
      data.fields.filter(({ key }) => key?.trim() !== '').map(({ key, value }) => [key, value])
    );

    onSubmit({
      name: data.name,
      description: data.description,
      data: json,
    } as T);
  };

  const defineField = (
    keyName: FieldPath<EnvFormData>,
    valueName: FieldPath<EnvFormData>,
    control: Control<EnvFormData>,
    key: string,
    action: ReactNode,
    keysValidatorProvider: () => string[],
    isRequired: boolean
  ) => (
    <Box key={key} display="flex" gap={1} alignItems="start">
      <Controller
        name={keyName}
        control={control}
        rules={{
          required:
            isRequired &&
            t('form.validation.required', {
              key: t('form.fields.key'),
            }),
          validate: (value) => {
            const keys = keysValidatorProvider();

            const duplicates = keys.filter((k) => k === (value as string)?.trim());

            return duplicates.length === 1 || t('form.validation.unique', { key: t('form.fields.key') });
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={t('form.fields.key')}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            onChange={(e) => {
              field.onChange(e);
              trigger('fields');
            }}
            size="small"
          />
        )}
      />

      <Controller
        name={valueName}
        control={control}
        render={({ field }) => <TextField {...field} label={t('form.fields.value')} fullWidth size="small" />}
      />

      {action}
    </Box>
  );

  return (
    <Box component="form" onSubmit={handleSubmit(internalOnSubmit)} width="100%">
      <Stack gap={1}>
        <Typography variant="body1">{t('form.section.details')}</Typography>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Required',
            minLength: {
              value: 1,
              message: t('form.validation.minLength', { length: 1 }),
            },
            maxLength: {
              value: 32,
              message: t('form.validation.maxLength', { length: 32 }),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('form.fields.name')}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            minLength: {
              value: 1,
              message: t('form.validation.minLength', { length: 1 }),
            },
            maxLength: {
              value: 1024,
              message: t('form.validation.maxLength', { length: 1024 }),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('form.fields.description')}
              fullWidth
              multiline
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
            />
          )}
        />
        <Stack direction="row">
          <Typography variant="body1" flex={1} alignContent="center">
            {t('form.section.variables')}
          </Typography>
          <Button variant="outlined" color="error" onClick={() => remove()}>
            <Delete />
          </Button>
        </Stack>
        {fields.map((item, index) =>
          defineField(
            `fields.${index}.key`,
            `fields.${index}.value`,
            control,
            item.id,
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                remove(index);
                trigger('temporaryField.key');
              }}
              sx={{ p: 1 }}
            >
              <Delete />
            </Button>,
            () =>
              getValues('fields')
                .map((f) => f.key?.trim())
                .filter(Boolean) as string[],
            true
          )
        )}

        {fields.length == 0 && (
          <Dropzone<Record<string, string>>
            onChange={(json) => {
              if (!json) return;
              const transformed = transformFields(json);
              replace(transformed);
            }}
          />
        )}

        {defineField(
          'temporaryField.key',
          'temporaryField.value',
          control,
          'temp',
          <Button
            variant="outlined"
            onClick={async () => {
              const res = await trigger('temporaryField.key');
              if (res) {
                const temporaryField = getValues('temporaryField');
                append(temporaryField);
                resetField('temporaryField');
              }
            }}
            sx={{ p: 1 }}
          >
            <Add />
          </Button>,
          () =>
            [
              ...getValues('fields')
                .map((f) => f.key?.trim())
                .filter(Boolean),
              getValues('temporaryField.key'),
            ] as string[],
          false
        )}

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" startIcon={<Save />}>
            {t('form.fields.save')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

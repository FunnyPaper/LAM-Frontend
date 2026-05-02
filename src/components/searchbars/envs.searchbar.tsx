import { ArrowDownward, ArrowUpward, Search } from '@mui/icons-material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export type EnvSearchParams = {
  filter?: {
    name?: string;
  };
  sort?: {
    order?: 'asc' | 'desc';
    field?: 'name' | 'createdAt' | 'updatedAt';
  };
};

export type EnvsSearchBarProps = {
  searchParams: EnvSearchParams;
  onSearchParamsChanged: (params: Partial<EnvSearchParams>) => void;
};

export function EnvsSearchBar({ searchParams, onSearchParamsChanged }: EnvsSearchBarProps) {
  const { t } = useTranslation('envs');

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        size="small"
        placeholder={t('form.fields.name')}
        sx={{ minWidth: 120 }}
        value={searchParams.filter?.name || ''}
        onChange={(e) =>
          onSearchParamsChanged({
            filter: { ...searchParams.filter, name: e.target.value },
          })
        }
      />

      <FormControl fullWidth sx={{ maxWidth: 200 }}>
        <InputLabel>{t('form.fields.sortBy')}</InputLabel>
        <Select
          size="small"
          value={searchParams.sort?.field || 'name'}
          onChange={(e) =>
            onSearchParamsChanged({
              sort: { ...searchParams, field: e.target.value },
            })
          }
          label={t('form.fields.sortBy')}
        >
          <MenuItem value="name">{t('form.fields.name')}</MenuItem>
          <MenuItem value="createdAt">{t('form.fields.createdAt')}</MenuItem>
          <MenuItem value="updatedAt">{t('form.fields.updatedAt')}</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        value={searchParams.sort?.order || 'asc'}
        onChange={(_, v) => onSearchParamsChanged({ sort: { ...searchParams.sort, order: v } })}
        exclusive
      >
        <ToggleButton value="asc">
          <ArrowUpward />
        </ToggleButton>
        <ToggleButton value="desc">
          <ArrowDownward />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}

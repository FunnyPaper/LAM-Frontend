import { ArrowDownward, ArrowUpward, Search } from '@mui/icons-material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScriptRunStatuses } from 'lam-frontend/api/queries/script-run.provider.dto';

export type ScriptRunSearchParams = {
  filter?: {
    status?: string;
  };
  sort?: {
    order?: 'asc' | 'desc';
    field?: 'status' | 'createdAt' | 'updatedAt' | 'finishedAt';
  };
};

export type ScriptRunsSearchBarProps = {
  onSearch: () => void;
  searchParams: ScriptRunSearchParams;
  onSearchParamsChanged: (params: Partial<ScriptRunSearchParams>) => void;
};

export function ScriptRunsSearchBar({ onSearch, searchParams, onSearchParamsChanged }: ScriptRunsSearchBarProps) {
  const { t } = useTranslation('runs');

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl fullWidth sx={{ maxWidth: 300 }} size="small">
        <InputLabel id="statusLabelId">{t('form.fields.status')}</InputLabel>
        <Select
          size="small"
          value={searchParams.filter?.status || ''}
          onChange={(e) =>
            onSearchParamsChanged({
              filter: { ...searchParams.filter, status: e.target.value },
            })
          }
          labelId="statusLabelId"
          label={t('form.fields.status')}
        >
          <MenuItem value="">
            <em>{t('form.fields.allStatuses')}</em>
          </MenuItem>
          {ScriptRunStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {t(`status.${status.toLowerCase()}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ maxWidth: 300 }}>
        <InputLabel>{t('form.fields.sortBy')}</InputLabel>
        <Select
          size="small"
          value={searchParams.sort?.field || 'createdAt'}
          onChange={(e) =>
            onSearchParamsChanged({
              sort: { ...searchParams.sort, field: e.target.value },
            })
          }
          label={t('form.fields.sortBy')}
        >
          <MenuItem value="status">{t('form.fields.status')}</MenuItem>
          <MenuItem value="createdAt">{t('form.fields.createdAt')}</MenuItem>
          <MenuItem value="updatedAt">{t('form.fields.updatedAt')}</MenuItem>
          <MenuItem value="finishedAt">{t('form.fields.finishedAt')}</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        value={searchParams.sort?.order || 'desc'}
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

      <Button
        onClick={onSearch}
        variant="outlined"
        size="small"
        sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
      >
        <Search />
      </Button>
    </Stack>
  );
}

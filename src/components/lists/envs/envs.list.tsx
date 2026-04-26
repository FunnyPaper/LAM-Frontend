import { Divider, Grid, Stack, TablePagination, Skeleton, Box } from '@mui/material';
import type { EnvDto } from '../../../api/queries/env.provider';
import { EnvsListItem } from './envs.list.item';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type EnvsListProps = {
  onEnvEditClick: (data: EnvDto) => void;
  onEnvDeleteClick: (data: EnvDto) => void;
  onPaginationParamsChange: (params: PaginationParams) => void;
  searchParams: PaginationParams;
  isLoading: boolean;
  envs?: Paginated<EnvDto>;
};

export function EnvsList({
  onEnvEditClick,
  onEnvDeleteClick,
  onPaginationParamsChange,
  searchParams,
  isLoading,
  envs,
}: EnvsListProps) {
  const { t } = useTranslation('envs');

  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationParamsChange({
      ...searchParams,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onPaginationParamsChange({
      ...searchParams,
      page: 0,
      limit: newRowsPerPage,
    });
  };

  if (isLoading) {
    return (
      <Stack gap={2}>
        <Grid container spacing={2} flex={1} alignContent="flex-start">
          {[...Array(envs?.metadata?.limit ?? 0)].map((_, i) => (
            <Grid key={i} size={12}>
              <Stack gap={1} p={2}>
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={15} />
                <Skeleton variant="text" height={15} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Box
      p={2}
      height="100%"
      sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}
    >
      <Stack gap={2} flex="1 1 auto">
        <Grid container spacing={2} flex={1} alignContent="flex-start">
          {envs?.data.map((env) => (
            <Grid key={env.id} size={12}>
              <EnvsListItem env={env} onEdit={onEnvEditClick} onDelete={onEnvDeleteClick} />
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Divider textAlign="right">
        <TablePagination
          component="div"
          sx={{
            alignSelf: 'flex-end',
          }}
          count={envs?.metadata?.totalItems ?? 0}
          page={searchParams.page}
          onPageChange={handleChangePage}
          rowsPerPage={searchParams.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ page }) => `${t('table.displayedRows')} ${page + 1}`}
          labelRowsPerPage={t('table.rowsPerPage')}
        />
      </Divider>
    </Box>
  );
}

import { Divider, Grid, Stack, TablePagination, Skeleton } from '@mui/material';
import type { ScriptDto } from '../../../api/queries/script.provider';
import { ScriptsListItem } from './scripts.list.item';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type ScriptsListProps = {
  onScriptEditClick: (data: ScriptDto) => void;
  onScriptDeleteClick: (data: ScriptDto) => void;
  onPaginationParamsChange: (params: PaginationParams) => void;
  searchParams: PaginationParams;
  scripts?: Paginated<ScriptDto>;
  isLoading: boolean;
};

export function ScriptsList({
  onScriptEditClick,
  onScriptDeleteClick,
  onPaginationParamsChange,
  searchParams,
  scripts,
  isLoading,
}: ScriptsListProps) {
  const { t } = useTranslation('scripts');

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
      <Stack gap={2} height="100%">
        <Grid container spacing={2} flex={1} alignContent="flex-start">
          {[...Array(scripts?.metadata?.limit ?? 0)].map((_, i) => (
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
    <Stack gap={2} height="100%">
      <Grid container spacing={2} flex={1} alignContent="flex-start">
        {scripts?.data.map((script) => (
          <Grid key={script.id} size={12}>
            <ScriptsListItem script={script} onEdit={onScriptEditClick} onDelete={onScriptDeleteClick} />
          </Grid>
        ))}
      </Grid>

      <Divider textAlign="right">
        <TablePagination
          component="div"
          sx={{
            alignSelf: 'flex-end',
          }}
          count={scripts?.metadata?.totalItems ?? 0}
          page={searchParams.page}
          onPageChange={handleChangePage}
          rowsPerPage={searchParams.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ page }) => `${t('table.displayedRows')} ${page + 1}`}
          labelRowsPerPage={t('table.rowsPerPage')}
        />
      </Divider>
    </Stack>
  );
}

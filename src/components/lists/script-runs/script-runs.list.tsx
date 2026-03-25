import { Divider, Grid, Stack, TablePagination, Skeleton } from '@mui/material';
import type { ScriptRunDto } from '../../../api/queries/script-run.provider.dto';
import { ScriptRunsListItem } from './script-runs.list.item';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type ScriptRunsListProps = {
  onScriptRunEditClick: (data: ScriptRunDto) => void;
  onScriptRunDeleteClick: (data: ScriptRunDto) => void;
  onScriptRunCancelClick: (data: ScriptRunDto) => void;
  onPaginationParamsChange: (params: PaginationParams) => void;
  searchParams: PaginationParams;
  scriptRuns?: Paginated<ScriptRunDto>;
  isLoading: boolean;
};

export function ScriptRunsList({
  onScriptRunEditClick,
  onScriptRunDeleteClick,
  onScriptRunCancelClick,
  onPaginationParamsChange,
  searchParams,
  scriptRuns,
  isLoading,
}: ScriptRunsListProps) {
  const { t } = useTranslation('runs');

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
          {[...Array(scriptRuns?.metadata?.limit ?? 10)].map((_, i) => (
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
        {scriptRuns?.data.map((scriptRun) => (
          <Grid key={scriptRun.id} size={12}>
            <ScriptRunsListItem
              scriptRun={scriptRun}
              onEdit={onScriptRunEditClick}
              onDelete={onScriptRunDeleteClick}
              onCancel={onScriptRunCancelClick}
            />
          </Grid>
        ))}
      </Grid>

      <Divider textAlign="right">
        <TablePagination
          component="div"
          sx={{
            alignSelf: 'flex-end',
          }}
          count={scriptRuns?.metadata?.totalItems ?? 0}
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

import { Typography, TablePagination, Box, tablePaginationClasses } from '@mui/material';
import type { Paginated, ScriptDto } from 'lam-frontend/api';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type EnvsTableProps = {
  isLoading: boolean;
  scripts?: Paginated<ScriptDto>;
  selectedScript: ScriptDto | null;
  onSelectScript: (script: ScriptDto | null) => void;
  searchParams: PaginationParams;
  onSearchParamsChange: (params: PaginationParams) => void;
};

export function ScriptsTable({
  isLoading,
  scripts,
  selectedScript,
  onSelectScript,
  searchParams,
  onSearchParamsChange,
}: EnvsTableProps) {
  const { t } = useTranslation('scripts');
  const handleSelectScript = useCallback(
    (script: ScriptDto) => {
      if (script == selectedScript) {
        onSelectScript(null);
      } else {
        onSelectScript(script);
      }
    },
    [onSelectScript, selectedScript]
  );

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      onSearchParamsChange({
        ...searchParams,
        page: newPage,
      });
    },
    [onSearchParamsChange, searchParams]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      onSearchParamsChange({
        ...searchParams,
        page: 0,
        limit: newRowsPerPage,
      });
    },
    [onSearchParamsChange, searchParams]
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
        width: '100%',
        minHeight: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'clip',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'common.black',
          color: 'common.white',
          px: 2,
          py: 1,
          fontWeight: 600,
        }}
      >
        <Typography>{t('table.name')}</Typography>
        <Typography>{t('table.description')}</Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridAutoRows: 'min-content',
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {isLoading ? (
          <Box>
            <Typography variant="body2">{t('table.loading')}</Typography>
          </Box>
        ) : (
          scripts?.data.map((script) => (
            <Box
              key={script.id}
              onClick={() => handleSelectScript(script)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                px: 2,
                py: 1,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedScript?.id === script.id ? 'primary.light' : 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{ color: selectedScript?.id == script.id ? 'primary.dark' : 'inherit' }}
              >
                {script.name}
              </Typography>
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{ color: selectedScript?.id == script.id ? 'primary.dark' : 'inherit' }}
              >
                {script.description || t('table.noDescription')}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TablePagination
          component="div"
          sx={{
            backgroundColor: 'background.paper',
            [`& .${tablePaginationClasses.selectLabel}`]: {
              margin: 0,
            },
            [`& .${tablePaginationClasses.displayedRows}`]: {
              margin: 0,
            },
            [`& .${tablePaginationClasses.toolbar}`]: {
              minHeight: 0,
            },
          }}
          count={scripts?.metadata?.totalItems ?? 0}
          page={searchParams.page}
          onPageChange={handleChangePage}
          rowsPerPage={searchParams.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ page }) => `${t('table.displayedRows')} ${page + 1}`}
          labelRowsPerPage={t('table.rowsPerPage')}
          size="small"
        />
      </Box>
    </Box>
  );
}

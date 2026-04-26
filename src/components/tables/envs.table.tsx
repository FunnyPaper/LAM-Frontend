import { Typography, TablePagination, Box, tablePaginationClasses } from '@mui/material';
import type { EnvDto, Paginated } from 'lam-frontend/api';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type EnvsTableProps = {
  isLoading: boolean;
  envs?: Paginated<EnvDto>;
  selectedEnv: EnvDto | null;
  onSelectEnv: (env: EnvDto | null) => void;
  searchParams: PaginationParams;
  onSearchParamsChange: (params: PaginationParams) => void;
};

export function EnvsTable({
  isLoading,
  envs,
  selectedEnv,
  onSelectEnv,
  searchParams,
  onSearchParamsChange,
}: EnvsTableProps) {
  const { t } = useTranslation('envs');
  const handleSelectEnv = useCallback(
    (env: EnvDto) => {
      if (env == selectedEnv) {
        onSelectEnv(null);
      } else {
        onSelectEnv(env);
      }
    },
    [onSelectEnv, selectedEnv]
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
          gridTemplateColumns: '1fr',
          backgroundColor: 'common.black',
          color: 'common.white',
          px: 2,
          py: 1,
          fontWeight: 600,
        }}
      >
        <Typography>{t('table.name')}</Typography>
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
          envs?.data.map((env) => (
            <Box
              key={env.id}
              onClick={() => handleSelectEnv(env)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                px: 2,
                py: 1,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedEnv?.id === env.id ? 'primary.light' : 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{
                  color: selectedEnv?.id === env.id ? 'primary.dark' : 'inherit',
                }}
              >
                {env.name}
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
          count={envs?.metadata?.totalItems ?? 0}
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

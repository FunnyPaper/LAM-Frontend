import { Typography, Box, TablePagination, tablePaginationClasses } from '@mui/material';
import type { Paginated, ScriptVersionDto } from 'lam-frontend/api';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type EnvsTableProps = {
  isLoading: boolean;
  scriptVersions?: Paginated<ScriptVersionDto>;
  selectedScriptVersion: ScriptVersionDto | null;
  onSelectScriptVersion: (scriptVersion: ScriptVersionDto | null) => void;
  searchParams: PaginationParams;
  onSearchParamsChange: (params: PaginationParams) => void;
};

export function ScriptsVersionTable({
  isLoading,
  scriptVersions,
  selectedScriptVersion,
  onSelectScriptVersion,
  searchParams,
  onSearchParamsChange,
}: EnvsTableProps) {
  const { t } = useTranslation('scripts');

  const handleSelectScriptVersion = useCallback(
    (scriptVersion: ScriptVersionDto) => {
      if (scriptVersion == selectedScriptVersion) {
        onSelectScriptVersion(null);
      } else {
        onSelectScriptVersion(scriptVersion);
      }
    },
    [onSelectScriptVersion, selectedScriptVersion]
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
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 2,
          backgroundColor: 'common.black',
          color: 'common.white',
          px: 2,
          py: 1,
          fontWeight: 600,
        }}
      >
        <Typography>{t('table.name')}</Typography>
        <Typography>{t('table.createdAt')}</Typography>
        <Typography>{t('table.updatedAt')}</Typography>
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
          scriptVersions?.data.map((scriptVersion) => (
            <Box
              key={scriptVersion.id}
              onClick={() => handleSelectScriptVersion(scriptVersion)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2,
                px: 2,
                py: 1,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedScriptVersion?.id === scriptVersion.id ? 'primary.light' : 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{ color: selectedScriptVersion?.id === scriptVersion.id ? 'primary.dark' : 'inherit' }}
              >
                {scriptVersion.name ?? '-'}
              </Typography>
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{ color: selectedScriptVersion?.id === scriptVersion.id ? 'primary.dark' : 'inherit' }}
              >
                {scriptVersion.createdAt ?? '-'}
              </Typography>
              <Typography
                noWrap
                textOverflow="ellipsis"
                fontSize={14}
                sx={{ color: selectedScriptVersion?.id === scriptVersion.id ? 'primary.dark' : 'inherit' }}
              >
                {scriptVersion.updatedAt ?? '-'}
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
          count={scriptVersions?.metadata?.totalItems ?? 0}
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

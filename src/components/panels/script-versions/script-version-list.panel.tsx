import { Box, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TablePagination, tablePaginationClasses } from '@mui/material';
import type { ScriptVersionDto } from 'lam-frontend/api';
import { getScriptVersionStateColor } from 'lam-frontend/utils/colors';
import type { PaginationParams } from 'lam-frontend/components/modals/preview-script.modal';
import type { Paginated } from 'lam-frontend/api/queries/paginated.provider';
import { formatShortDate } from 'lam-frontend/utils/date';

export type ScriptVersionListPanelProps = {
  scriptVersions: Paginated<ScriptVersionDto> | undefined;
  searchParams: PaginationParams;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectVersion: (version: ScriptVersionDto) => void;
  totalItems: number;
};

export function ScriptVersionListPanel({
  scriptVersions,
  searchParams,
  onPageChange,
  onRowsPerPageChange,
  onSelectVersion,
  totalItems,
}: ScriptVersionListPanelProps) {
  const { t } = useTranslation('scripts');

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
        flex: 1,
        minHeight: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'clip',
      }}
    >
      <Box
        sx={(theme) => ({
          display: 'grid',
          justifyContent: 'start',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 2,
          backgroundColor: theme.palette.background.paper,
          px: 2,
          py: 1,
          fontWeight: 600,
          borderBottom: '1px solid',
          borderColor: 'divider',
        })}
      >
        <Typography>{t('table.name')}</Typography>
        <Typography>{t('table.status')}</Typography>
        <Typography>{t('table.createdAt')}</Typography>
      </Box>
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridAutoRows: 'min-content',
          overflowY: 'auto',
          minHeight: 0,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
          },
        })}
      >
        {scriptVersions?.data.map((version) => (
          <Box
            key={version.id}
            onClick={() => onSelectVersion(version)}
            sx={(theme) => ({
              display: 'grid',
              justifyContent: 'start',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 2,
              px: 2,
              py: 1,
              cursor: 'pointer',
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            <Typography noWrap textOverflow="ellipsis" fontSize={14}>
              {version.name ?? '-'}
            </Typography>
            <Chip
              label={t(`version.status.${version.status.toLowerCase()}`)}
              size="small"
              variant="filled"
              color={getScriptVersionStateColor(version.status)}
            />
            <Typography noWrap textOverflow="ellipsis" fontSize={14}>
              {formatShortDate(version.createdAt)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <TablePagination
          component="div"
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
            [`& .${tablePaginationClasses.selectLabel}`]: {
              margin: 0,
            },
            [`& .${tablePaginationClasses.displayedRows}`]: {
              margin: 0,
            },
            [`& .${tablePaginationClasses.toolbar}`]: {
              minHeight: 0,
            },
          })}
          count={totalItems}
          page={searchParams.page}
          onPageChange={onPageChange}
          rowsPerPage={searchParams.limit}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ page }) => `${t('table.displayedRows')} ${page + 1}`}
          labelRowsPerPage={t('table.rowsPerPage')}
          size="small"
        />
      </Box>
    </Box>
  );
}
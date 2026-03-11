import { Divider, Grid, Stack, TablePagination } from '@mui/material';
import type { EnvDto } from '../../../api/queries/env.provider';
import { use, useContext, useMemo } from 'react';
import { ApiProvider } from '../../../api/api.provider';
import EnvsListItem from './envs.list.item';

export type EnvsListProps = {
  onButtonCreateClick: () => void;
  onEnvEditClick: (data: EnvDto) => void;
};

export default function EnvsList({
  onButtonCreateClick,
  onEnvEditClick,
}: EnvsListProps) {
  const { getEnvs } = useContext(ApiProvider);
  const envs = useMemo(() => getEnvs(), [getEnvs]);
  const awaitedEnvs = use(envs);

  return (
    <Stack gap={2} height="100%">
      <Grid container spacing={2} flex={1} alignContent="flex-start">
        {awaitedEnvs.map((env) => (
          <Grid key={env.id} size={12}>
            <EnvsListItem env={env} onEdit={onEnvEditClick} />
          </Grid>
        ))}
      </Grid>

      <Divider textAlign="right">
        <TablePagination
          component="div"
          sx={{
            alignSelf: 'flex-end',
          }}
          count={100}
          page={1}
          onPageChange={() => {}}
          rowsPerPage={10}
        />
      </Divider>
    </Stack>
  );
}

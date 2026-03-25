import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { EnvDto } from '../../../api/queries/env.provider';
import { AddCircle, Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import { format } from 'date-fns';

export type EnvsListItemProps = {
  env: EnvDto;
  onEdit: (data: EnvDto) => void;
  onDelete: (data: EnvDto) => void;
};

export function EnvsListItem({ env, onEdit, onDelete }: EnvsListItemProps) {
  const [expand, setExpand] = useState(false);

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row">
            {env.description && (
              <IconButton onClick={() => setExpand((p) => !p)}>{!expand ? <ExpandMore /> : <ExpandLess />}</IconButton>
            )}
            <IconButton onClick={() => onEdit(env)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(env)}>
              <Delete />
            </IconButton>
          </Stack>
        }
        title={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Typography noWrap={false} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {env.name}
            </Typography>
            {env.createdAt && (
              <Chip
                icon={<AddCircle />}
                label={format(new Date(env.createdAt), 'yyyy/MM/dd HH:mm')}
                size="small"
                variant="outlined"
              />
            )}
            {env.updatedAt && (
              <Chip
                icon={<Edit />}
                label={format(new Date(env.updatedAt), 'yyyy/MM/dd HH:mm')}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        }
        sx={{
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            display: 'grid',
          },
        }}
      />

      <Collapse in={expand}>
        <Divider />
        <CardContent sx={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {env.description && (
            <Typography variant="body2" textAlign="justify">
              {env.description}
            </Typography>
          )}
          {env.data && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="body2" component="pre">
                {JSON.stringify(env.data, null, 2)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}

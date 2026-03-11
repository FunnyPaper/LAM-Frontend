import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { EnvDto } from '../../../api/queries/env.provider';
import { Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';

export type EnvsListItemProps = {
  env: EnvDto;
  onEdit: (data: EnvDto) => void;
};

export default function EnvsListItem({ env, onEdit }: EnvsListItemProps) {
  const [expand, setExpand] = useState(false);

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row">
            {env.description && (
              <IconButton onClick={() => setExpand((p) => !p)}>
                {!expand ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            )}
            <IconButton onClick={() => onEdit(env)}>
              <Edit />
            </IconButton>
            <IconButton>
              <Delete />
            </IconButton>
          </Stack>
        }
        title={
          <Typography
            noWrap={false}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {env.name}
          </Typography>
        }
        sx={{
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            display: 'grid',
          },
        }}
      />
      {env.description && (
        <Collapse in={expand}>
          <Divider />
          <CardContent sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <Typography variant="body2" textAlign="justify">
              {env.description}
            </Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}

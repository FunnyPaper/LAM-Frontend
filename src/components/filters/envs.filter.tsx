import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';

export default function EnvsFilter() {
  const [nameFilter, setNameFilter] = useState<string>();
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        size="small"
        placeholder="name"
        sx={{ minWidth: 120 }}
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />

      <FormControl fullWidth sx={{ maxWidth: 200 }}>
        <InputLabel>Order by</InputLabel>
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Order by"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="createdAt">Created at</MenuItem>
          <MenuItem value="updatedAt">Updated at</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        value={sortOrder}
        onChange={(_, v) => setSortOrder(v)}
        exclusive
      >
        <ToggleButton value="asc">
          <ArrowUpward />
        </ToggleButton>
        <ToggleButton value="desc">
          <ArrowDownward />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}

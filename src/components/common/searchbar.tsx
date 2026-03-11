import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

export type SearchBarProps = {
  value: string;
  onChange: (data: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      size="small"
      placeholder="search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

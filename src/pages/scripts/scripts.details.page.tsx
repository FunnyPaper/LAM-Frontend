import { Typography } from '@mui/material';
import { useParams } from 'react-router';

export default function ScriptsDetailsPage() {
  const { id } = useParams();

  return <Typography>Scripts {id}</Typography>;
}

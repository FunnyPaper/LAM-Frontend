import { Typography } from '@mui/material';
import { useParams } from 'react-router';

export default function RunsDetailsPage() {
  const { id } = useParams();

  return <Typography>Runs {id}</Typography>;
}

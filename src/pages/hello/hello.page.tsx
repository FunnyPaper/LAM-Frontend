import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router';

export default function HelloPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Hello Page</h1>
      <Button variant="contained" onClick={() => navigate('/flow')}>
        Flow
      </Button>
    </>
  );
}

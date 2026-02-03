import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Landing Page</h1>
      <Button variant="contained" onClick={() => navigate('/hello')}>
        Hello
      </Button>
    </>
  );
}

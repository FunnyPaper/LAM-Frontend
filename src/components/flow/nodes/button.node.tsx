import { Button } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import { Link, useNavigate } from 'react-router';

export default function ButtonNode({ data: { label, path } }: any) {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="contained" onClick={() => navigate(path)}>
        {label}
      </Button>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </>
  );
}

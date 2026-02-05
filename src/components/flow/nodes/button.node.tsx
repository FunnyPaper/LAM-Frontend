import { Button } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import { useNavigate } from 'react-router';

function ButtonNode({ data: { label, path } }: any) {
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

export default memo(ButtonNode);

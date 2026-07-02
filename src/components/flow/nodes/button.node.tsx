import { Button } from '@mui/material';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { useNavigate } from 'react-router';

type ButtonNodeData = {
  label: string;
  path: string;
}

type ButtonNodeProps = NodeProps & {
  data: ButtonNodeData;
}

function ButtonNode({ data: { label, path } }: ButtonNodeProps) {
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

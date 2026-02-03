import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ProOptions,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../../components/flow/nodes/node.type';

const initialNodes: Node[] = [
  {
    id: 'n1',
    type: 'button',
    position: { x: 0, y: 0 },
    data: { label: 'Landing', path: '/' },
  },
  {
    id: 'n2',
    type: 'button',
    position: { x: 0, y: 100 },
    data: { label: 'Hello', path: '/hello' },
  },
];

const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const proOptions: ProOptions = { hideAttribution: true };

export default function FlowPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((snap) => applyNodeChanges(changes, snap)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((snap) => applyEdgeChanges(changes, snap)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((snap) => addEdge(params, snap)),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        colorMode="dark"
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

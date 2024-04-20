import TextUpdaterNode from "@/lib/Nodes/TextBoxUpdaterNode";
import PlainTextUpdaterNode from "@/lib/Nodes/PlainTextUpdaterNode";
import React, { useCallback, useState, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 45 },
    data: {
      label:
        "const circle = rounded-full size-24 p-3 const triangle = size-24 rotate-45",
    },
  },
  { id: "2", position: { x: 234, y: 567 }, data: { label: "2" } },
  { id: "3", position: { x: 561, y: 657 }, data: { label: "3" } },
  { id: "4", position: { x: 671, y: 132 }, data: { label: "4" } },
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 435, y: 786 },
    data: { value: 123 },
  },
  {
    id: "node-2",
    type: "plaintextUpdater",
    position: { x: 198, y: 57 },
    data: { value: 54 },
  },
  { id: "5", position: { x: 456, y: 733 }, data: { label: "5" } },
  { id: "6", position: { x: 678, y: 293 }, data: { label: "6" } },
  { id: "7", position: { x: 826, y: 784 }, data: { label: "7" } },
  { id: "8", position: { x: 982, y: 300 }, data: { label: "8" } },
  { id: "9", position: { x: 759, y: 864 }, data: { label: "9" } },
  { id: "10", position: { x: 256, y: 100 }, data: { label: "10" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
  { id: "e6-7", source: "6", target: "7", animated: true },
  { id: "e7-8", source: "7", target: "8", animated: true },
  { id: "e8-9", source: "8", target: "9", animated: true },
  { id: "e9-10", source: "9", target: "10" },
  { id: "e10-1", source: "10", target: "1" },
];
export default function DrawBoard() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      textUpdater: TextUpdaterNode,
      plaintextUpdater: PlainTextUpdaterNode,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-[78.5vw] h-[88vh] border-2 rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

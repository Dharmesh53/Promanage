import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from 'reactflow'
import socket from '@/lib/socket'
import { useSelector } from 'react-redux'

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) {
  const { setEdges } = useReactFlow()
  const projectId = useSelector((state) => state.project?.project?.project?._id)

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = () => {
    setEdges((edges) => {
      const newEdges = edges.filter((edge) => edge.id !== id)
      socket.emit('updateEdges:client', newEdges, projectId, (response) => {
        console.log(response)
      })
      return newEdges
    })
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
        >
          {selected && (
            <button
              className="size-5 bg-[#eee] border rounded-full"
              onClick={onEdgeClick}
            >
              ×
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

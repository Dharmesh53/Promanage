import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'
import { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaRegSquare, FaRegCircle } from 'react-icons/fa'
import { LuTextCursor } from 'react-icons/lu'
import { PiTextbox } from 'react-icons/pi'
import { IoImageOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import 'reactflow/dist/style.css'

import socket from '@/lib/socket'
import { throttle } from '@/lib/utils'
import TextBoxNode from '@/lib/Nodes/TextBoxNode'
import PlainTextNode from '@/lib/Nodes/PlainTextNode'
import ImageNode from '@/lib/Nodes/ImageNode'
import CustomEdge from '@/lib/Edges/customEdge'
import ShapeNode from '@/lib/Nodes/ShapeNode'
import UserCursor from './ui/userCursor'
import {
  createSquare,
  createCircle,
  createPlainText,
  createTextBox,
  insertImage,
} from '@/lib/createNodes'
import { getBgColor } from '@/lib/getColor'
import useSocketHandlers from '@/lib/useSocketHandlers'

const nodeTypes = {
  textBox: TextBoxNode,
  plaintext: PlainTextNode,
  image: ImageNode,
  shape: ShapeNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

const ToolButton = ({ icon: Icon, onClick, Size }) => (
  <button
    className="focus-within:bg-neutral-200 hover:bg-orange-100 transition-all duration-200 rounded p-2 m-1"
    onClick={onClick}
  >
    <Icon size={Size} />
  </button>
)

const ToolBar = ({ CreateNode, imageRef }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="bg-white z-20 flex absolute top-0 tools rounded"
    >
      <ToolButton
        icon={FaRegSquare}
        Size={20}
        onClick={() => CreateNode('square')}
      />
      <ToolButton
        icon={FaRegCircle}
        Size={20}
        onClick={() => CreateNode('circle')}
      />
      <ToolButton
        icon={LuTextCursor}
        Size={20}
        onClick={() => CreateNode('plaintext')}
      />
      <ToolButton
        icon={PiTextbox}
        Size={28}
        onClick={() => CreateNode('textbox')}
      />
      <ToolButton
        icon={IoImageOutline}
        Size={23}
        onClick={() => imageRef?.current.click()}
      />
    </motion.div>
  </AnimatePresence>
)

export default function DrawBoard({ className }) {
  const projectId = useSelector((state) => state.project?.project?.project?._id)
  const user = useSelector((state) => state.auth.user)
  const divRef = useRef(null)
  const imageRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodeMoving, setNodeMoving] = useState(null)
  const [onlineUsers, userCursors, setUserCursors] = useSocketHandlers(
    user,
    projectId,
    setNodes,
    setEdges
  )

  const memoizedNodeTypes = useMemo(() => nodeTypes, [])
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [])

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, type: 'customEdge' }
      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds)
        socket.emit('updateEdges:client', newEdges, projectId, (response) => {
          console.log(response)
        })
        return newEdges
      })
    },
    [projectId]
  )

  const createNodeFunctions = {
    square: createSquare,
    circle: createCircle,
    plaintext: createPlainText,
    textbox: createTextBox,
    image: insertImage,
  }

  const CreateNode = async (type) => {
    const createNode = createNodeFunctions[type]

    const node =
      type === 'image'
        ? await createNode(divRef, imageRef, projectId)
        : await createNode(divRef)

    if (node && projectId) {
      socket.emit('newNode:client', node, projectId, (response) => {
        console.log(response)
      })
      setNodes((prev) => [...prev, node])
    }
  }

  const handleMouseMove = useCallback(
    throttle((event) => {
      const limitX = window.innerWidth - divRef?.current.clientWidth
      const limitY = window.innerHeight - divRef?.current.clientHeight

      if (event.clientY > limitY && event.clientX > limitX) {
        const data = {
          email: user.email,
          position: {
            x: event.clientX - limitX,
            y: event.clientY - limitY,
          },
        }

        socket.emit('mouseMove:client', data, projectId, (response) => {
          console.log(response)
        })
      }
    }, 50),
    [projectId, user]
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  useEffect(() => {
    if (nodeMoving) {
      const nodeIndex = nodes.findIndex((node) => node.id === nodeMoving?.id)
      const node = {
        id: nodes[nodeIndex]?.id,
        position: nodes[nodeIndex]?.position,
        width: nodes[nodeIndex]?.width,
        height: nodes[nodeIndex]?.height,
      }
      throttle(
        () =>
          socket.emit('nodeMove:client', node, projectId, (response) => {
            console.log(response)
          }),
        100
      )()
    }
  }, [nodes, nodeMoving, projectId])

  return (
    <div className={`${className} border-2 rounded-md relative`} ref={divRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={(event, node) => setNodeMoving(node)}
        onNodeDragStop={() => setNodeMoving(null)}
        onNodeDrag={handleMouseMove}
        onConnect={onConnect}
        className="z-10"
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <input
        type="file"
        id="imageInput"
        ref={imageRef}
        className="hidden"
        accept="image/*"
        onChange={() => CreateNode('image')}
      />
      <ToolBar CreateNode={CreateNode} imageRef={imageRef} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="bg-white flex absolute m-1 top-0 right-0 rounded"
        >
          {onlineUsers.map((email, i) => (
            <span
              key={i}
              style={{ marginLeft: i * -10 }}
              className={`rounded-full z-10 flex justify-center font-medium text-white items-center size-5 p-3 ${getBgColor(email)}`}
            >
              {email.substring(0, 1).toUpperCase()}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
      {onlineUsers.map((email, i) => (
        <UserCursor
          key={i}
          email={email}
          position={userCursors[email]}
          colorClass={getBgColor(email)}
        />
      ))}
    </div>
  )
}

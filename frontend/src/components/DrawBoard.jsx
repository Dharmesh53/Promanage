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
import { FaRegSquare } from 'react-icons/fa6'
import { FaRegCircle } from 'react-icons/fa'
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
import getColor from '@/lib/getColor'

const nodeTypes = {
  textBox: TextBoxNode,
  plaintext: PlainTextNode,
  image: ImageNode,
  shape: ShapeNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

export default function DrawBoard({ className }) {
  // **************** Components States ****************
  const projectId = useSelector((state) => state.project?.project?.project?._id)
  const user = useSelector((state) => state.auth.user)
  const divRef = useRef(null)
  const imageRef = useRef(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodeMoving, setNodeMoving] = useState(null)
  const [userCursors, setUserCursors] = useState({})

  //  Nodes and edges types ****************
  const memoizedNodeTypes = useMemo(() => nodeTypes, [])
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [])

  //  Nodes and Edges update functions ****************
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

  //  Create Nodes ****************
  const CreateNode = async (type) => {
    var node = null
    console.log('hello')
    switch (type) {
      case 'square':
        node = createSquare(divRef)
        break
      case 'circle':
        node = createCircle(divRef)
        break
      case 'plaintext':
        node = createPlainText(divRef)
        break
      case 'textbox':
        node = createTextBox(divRef)
        break
      case 'image':
        node = await insertImage(divRef, imageRef)
        break
      default:
        node = null
    }
    if (node && projectId) {
      socket.emit('newNode:client', node, projectId, (response) => {
        console.log(response)
      })
      setNodes((prev) => [...prev, node])
    }
  }

  //  Throttle the Nodes for collobrations ****************
  const throttleEmitEvent = throttle((data) => {
    socket.emit('nodeMove:client', data, projectId)
  }, 100)

  // --- Join Room on Drawboard mounts ---
  useEffect(() => {
    socket.emit('joinRoom:client', user.email, projectId, (response) => {
      console.log(response)
    })

    const handleMouseMove = throttle((event) => {
      console.log('fkjghd')
      const data = {
        email: user.email,
        position: { x: event.clientX, y: event.clientY },
      }
      socket.emit('mouseMove:client', data, projectId)
    }, 50)

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [projectId, user])

  // --- Load Nodes and Edges, Handle Node Movement, Handle Edges Change ---
  useEffect(() => {
    const handleJoinRoom = (onlineUsersArray) => {
      onlineUsersArray = onlineUsersArray.filter((email) => email != user.email)
      setOnlineUsers(onlineUsersArray)
    }
    const handleLoadNodesAndEdges = (data) => {
      setNodes(data.roomNodes)
      setEdges(data.roomEdges)
    }

    const handleNodeMove = (transferedNode) => {
      setNodes((nds) => {
        return nds.map((node) =>
          node.id === transferedNode.id
            ? {
                ...node,
                position: transferedNode.position || node.position,
                width: transferedNode.width || node.width,
                height: transferedNode.height || node.height,
              }
            : node
        )
      })
    }

    const handleDeleteNode = (id) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id))
    }

    const handleUpdateEdges = (edges) => setEdges(edges)

    const handleNewNode = (node) => setNodes((prev) => [...prev, node])

    const handleMouseMove = (data) => {
      setUserCursors((prev) => ({
        ...prev,
        [data.email]: data.position,
      }))
    }
    socket.on('joinRoom:server', handleJoinRoom)
    socket.on('nodeMove:server', handleNodeMove)
    socket.on('newNode:server', handleNewNode)
    socket.on('deleteNode:server', handleDeleteNode)
    socket.on('loadNodesAndEdges', handleLoadNodesAndEdges)
    socket.on('updateEdges:server', handleUpdateEdges)
    socket.on('mouseMove:server', handleMouseMove)
    return () => {
      socket.off('joinRoom:server', handleJoinRoom)
      socket.off('loadNodesAndEdges', handleLoadNodesAndEdges)
      socket.off('nodeMove:server', handleNodeMove)
      socket.off('updateEdges:server', handleUpdateEdges)
      socket.off('deleteNode:server', handleDeleteNode)
      socket.off('newNode:server', handleNewNode)
      socket.off('mouseMove:server', handleMouseMove)
    }
  }, [user.email])

  // --- Throttle Node Movement Events ---
  useEffect(() => {
    if (nodeMoving) {
      const nodeIndex = nodes.findIndex((node) => node.id === nodeMoving?.id)
      const node = {
        id: nodes[nodeIndex]?.id,
        position: nodes[nodeIndex]?.position,
        width: nodes[nodeIndex]?.width,
        height: nodes[nodeIndex]?.height,
      }
      throttleEmitEvent(node)
    }
  }, [nodes, nodeMoving, throttleEmitEvent])

  return (
    <div className={`${className} border-2 rounded-md relative`} ref={divRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={(event, node) => {
          setNodeMoving(node)
        }}
        onNodeDragStop={() => {
          setNodeMoving(null)
        }}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <input
        type="file"
        ref={imageRef}
        className="hidden"
        accept="image/*"
        onChange={() => CreateNode('image')}
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="bg-white flex absolute top-0 tools rounded"
        >
          <button
            className="focus-within:bg-neutral-200 rounded p-1 px-3"
            onClick={() => CreateNode('square')}
          >
            <FaRegSquare size={20} />
          </button>
          <button
            className="focus-within:bg-neutral-200 rounded p-1 px-3"
            onClick={() => CreateNode('circle')}
          >
            <FaRegCircle size={20} />
          </button>
          <button
            className="focus-within:bg-neutral-200 rounded p-1 px-3"
            onClick={() => CreateNode('plaintext')}
          >
            <LuTextCursor size={18} />
          </button>
          <button
            className="focus-within:bg-neutral-200 rounded p-1 px-3"
            onClick={() => CreateNode('textbox')}
          >
            <PiTextbox size={30} />
          </button>
          <button
            className="focus-within:bg-neutral-200 rounded p-1 px-3"
            onClick={() => {
              imageRef?.current?.click()
            }}
          >
            <IoImageOutline size={25} />
          </button>
        </motion.div>
      </AnimatePresence>
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
              className={`rounded-full flex justify-center font-medium text-white items-center size-5 p-3 ${getColor(email)}`}
            >
              {email.substring(0, 1).toUpperCase()}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
      {onlineUsers.map((email, i) => (
        <UserCursor
          key={email}
          email={email}
          position={userCursors[email]}
          colorClass={getColor(email)}
        />
      ))}
    </div>
  )
}

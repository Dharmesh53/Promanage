/* eslint-disable react/prop-types */
// import { useDispatch } from "react-redux";
// import { setDrawing } from "@/store/drawBoardSlice";
import socket from '@/lib/socket'
import { throttle } from '@/lib/utils'
import TextBoxNode from '@/lib/Nodes/TextBoxNode'
import PlainTextNode from '@/lib/Nodes/PlainTextNode'
import ImageNode from '@/lib/Nodes/ImageNode'
import customEdge from '@/lib/Edges/customEdge'
import { useSelector } from 'react-redux'
import {
  createSquare,
  createCircle,
  createPlainText,
  createTextBox,
  insertImage,
} from '@/lib/createNodes'
import ShapeNode from '@/lib/Nodes/ShapeNode'
import { useCallback, useState, useMemo, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'
import { FaRegSquare } from 'react-icons/fa6'
import { FaRegCircle } from 'react-icons/fa'
import { LuTextCursor } from 'react-icons/lu'
import { PiTextbox } from 'react-icons/pi'
import { IoImageOutline } from 'react-icons/io5'
import 'reactflow/dist/style.css'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DrawBoard({ className }) {
  // **************** Components States ****************

  // const dispatch = useDispatch();
  const projectId = useSelector((state) => state.project?.project?.project?._id)
  const divRef = useRef(null)
  const imageRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodeMoving, setNodeMoving] = useState(null)

  //  Nodes and edges types ****************
  const nodeTypes = useMemo(
    () => ({
      textBox: (props) => (
        <TextBoxNode {...props} nodes={nodes} setNodes={setNodes} />
      ),
      plaintext: (props) => (
        <PlainTextNode {...props} nodes={nodes} setNodes={setNodes} />
      ),
      image: (props) => (
        <ImageNode {...props} nodes={nodes} setNodes={setNodes} />
      ),
      shape: (props) => (
        <ShapeNode {...props} nodes={nodes} setNodes={setNodes} />
      ),
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      customEdge: customEdge,
    }),
    []
  )

  //  Nodes and Edges update functions ****************

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

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
    [setEdges]
  )

  //  Create Nodes ****************

  const CreateNode = async (type) => {
    var node = null
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
      socket.emit('newNode', node, projectId, (response) => {
        console.log(response)
      })
      setNodes((prev) => [...prev, node])
    }
  }

  //  Throttle the Nodes for collobrations ****************

  const throttleEmitEvent = throttle((data) => {
    socket.emit('nodeMove:client', data, projectId)
  }, 100)

  //  Socket events ****************

  // --- Join Room on Drawboard mounts ---
  useEffect(() => {
    socket.emit('joinRoom', projectId, (response) => {
      console.log(response)
    })
  }, [projectId])

  // --- Load Nodes and Edges, Handle Node Movement, Handle Edges Change ---
  useEffect(() => {
    const handleLoadNodesAndEdges = (data) => {
      setNodes(data.roomNodes)
      setEdges(data.roomEdges)
    }

    const handleNodeMove = (transferedNode) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === transferedNode.id
            ? {
                ...node,
                position: transferedNode.position || node.position,
                width: transferedNode.width || node.width,
                height: transferedNode.height || node.height,
              }
            : node
        )
      )
    }

    const handleDeleteNode = (id) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id))
    }

    socket.on('updateEdges:server', (edges) => {
      setEdges(edges)
    })
    socket.on('nodeMove:server', handleNodeMove)
    socket.on('deleteNode:server', handleDeleteNode)
    socket.on('loadNodesAndEdges', handleLoadNodesAndEdges)

    return () => {
      socket.off('loadNodesAndEdges', handleLoadNodesAndEdges)
      socket.off('nodeMove:server', handleNodeMove)
      socket.off('updateEdges:server')
    }
  }, [])

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

  // ---- Handle Edge Updates from Server ----
  useEffect(() => {}, [])

  return (
    <div className={`${className} border-2 rounded-md relative`} ref={divRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={(e, node) => {
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
          {/* <button
          className="focus-within:bg-neutral-200 rounded p-1 px-3"
          onClick={() => {
            dispatch(setDrawing(true));
          }}
        >
          <LuPen size={20} />
        </button> */}
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
    </div>
  )
}

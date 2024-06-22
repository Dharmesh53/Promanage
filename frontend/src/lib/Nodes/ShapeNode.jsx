import { useRef, useState, useEffect } from 'react'
import { NodeResizer } from 'reactflow'
import { Handle, Position } from 'reactflow'
import { motion, AnimatePresence } from 'framer-motion'
import { TwitterPicker } from 'react-color'
import { MdDeleteOutline } from 'react-icons/md'
import { CgColorBucket } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import socket from '@/lib/socket'
import darker from '@/lib/TurnDarker'
import { useReactFlow } from 'reactflow'

const ShapeNode = (props) => {
  const reactFlow = useReactFlow()
  const shapeRef = useRef(null)
  const [popover, setPopover] = useState(false)
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [bgColor, setBgColor] = useState(props?.data?.color || '#cccccc')
  const [size, setSize] = useState({
    width: props.data?.width || '100%',
    height: props.data?.height || '100%',
  })
  const projectId = useSelector((state) => state.project?.project?.project._id)

  const handleColorChange = (color) => {
    setBgColor(color.hex)
    const data = {
      id: props.id,
      color: color.hex,
    }
    socket.emit('colorChange:client', data, projectId, (response) => {
      console.log(response)
    })
    setColorPickerVisible(false)
  }

  const handleDelete = () => {
    reactFlow.setNodes((nodes) => nodes.filter((node) => node.id !== props.id))
    socket.emit('deleteNode:client', props.id, projectId, (response) => {
      console.log(response)
    })
  }

  useEffect(() => {
    const handleResize = (data) => {
      if (props.id === data.id) {
        setSize({ width: data.width, height: data.height })
      }
    }

    const handleColor = (data) => {
      if (data.id == props.id) {
        props.data.color = data.color
        setBgColor(data.color)
      }
    }
    socket.on('resize:server', handleResize)
    socket.on('colorChange:server', handleColor)

    return () => {
      socket.off('resize:server', handleResize)
      socket.off('colorChange:server', handleColor)
    }
  }, [props.data, props.id])

  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ background: darker(bgColor, 20) }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        style={{ background: darker(bgColor, 20) }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="c"
        style={{ background: darker(bgColor, 20) }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="d"
        style={{ background: darker(bgColor, 20) }}
      />
      <NodeResizer
        isVisible={props.selected}
        color="#d6921e"
        minWidth={40}
        minHeight={40}
        onResize={(event, params) => {
          const data = {
            id: props.id,
            width: params.width,
            height: params.height,
          }
          setSize({
            width: params.width,
            height: params.height,
          })
          socket.emit('resize:client', data, projectId, (response) => {
            console.log(response)
          })
        }}
      />
      <div
        ref={shapeRef}
        onContextMenu={(e) => {
          e.preventDefault()
          setPopover((prev) => !prev)
        }}
        className={`bg-[#22194d] ${
          props.data.shape === 'square' ? 'rounded-lg' : 'rounded-full'
        } h-full min-w-10 min-h-10`}
        style={{
          backgroundColor: bgColor,
          width: size.width,
          height: size.height,
        }}
      >
        <AnimatePresence>
          {popover && (
            <motion.div
              className="absolute right-[90%] gap-1 bg-white border flex rounded scale-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <button
                onClick={() => setColorPickerVisible((prev) => !prev)}
                className="hover:bg-slate-200 gap-2 p-1"
              >
                <CgColorBucket size={16} />
              </button>
              <button
                className="hover:bg-slate-200 gap-2 p-1"
                onClick={handleDelete}
              >
                <MdDeleteOutline size={16} />
              </button>
              {colorPickerVisible && (
                <div className="absolute z-10">
                  <TwitterPicker
                    color={bgColor}
                    triangle="hide"
                    onChangeComplete={handleColorChange}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default ShapeNode

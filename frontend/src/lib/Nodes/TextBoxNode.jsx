import { Label } from '@/components/ui/label'
import { useState, useRef, useEffect } from 'react'
import { NodeResizer, Handle, Position } from 'reactflow'
import { MdTextIncrease } from 'react-icons/md'
import { TbCopy } from 'react-icons/tb'
import { MdTextDecrease } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'
import { MdDeleteOutline } from 'react-icons/md'
import { useSelector } from 'react-redux'
import socket from '@/lib/socket'
import { useReactFlow } from 'reactflow'

export default function TextBoxNode(props) {
  const Fonts = [
    'text-xs',
    'text-sm',
    'text-md',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
  ]
  const reactFlow = useReactFlow()
  const textareaRef = useRef(null)
  const [popover, setPopover] = useState(false)
  const [fontSize, setFontSize] = useState(props.data?.fontSize || 0)
  const [width, setWidth] = useState(props.data?.width)
  const [height, setHeight] = useState(props.data?.height)
  const [text, setText] = useState(props.data?.value)
  const projectId = useSelector((state) => state.project?.project?.project._id)

  // function adjustHeight() {
  //   let element = textareaRef.current;
  //   if (element.scrollHeight < 80 * 16 && element.scrollHeight > height) {
  //     element.style.height = "1px";
  //     element.style.height = 5 + element.scrollHeight + "px";
  //   } else {
  //     element.style.height = "100px";
  //   }
  // }

  const onChange = (e) => {
    props.data.value = e.target.value
    setText(props.data.value)
    const data = {
      id: props.id,
      text: props.data.value,
    }
    socket.emit('BoxTextChange:client', data, projectId, (response) => {
      console.log(response)
    })
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    setPopover((prev) => !prev)
  }

  const handleDelete = () => {
    socket.emit('deleteNode:client', props.id, projectId, (response) => {
      console.log(response)
    })
    reactFlow.setNodes((nodes) => nodes.filter((node) => node.id !== props.id))
  }

  const handleTextChange = (direction) => {
    const data = {
      id: props.id,
      fontSize: null,
    }

    if (direction === 'up') {
      setFontSize((prev) => {
        const newSize = Math.min(prev + 1, 6)
        data.fontSize = newSize
        socket.emit('TextSizeChange:client', data, projectId, (response) => {
          console.log(response)
        })
        return newSize
      })
    }
    if (direction === 'down') {
      setFontSize((prev) => {
        const newSize = Math.max(prev - 1, 1)
        data.fontSize = newSize
        socket.emit('TextSizeChange:client', data, projectId, (response) => {
          console.log(response)
        })
        return newSize
      })
    }
  }

  useEffect(() => {
    const handleBoxText = (data) => {
      if (props.id === data.id) {
        setText(data.text)
        props.data.value = data.text
      }
    }

    const handleResize = (data) => {
      if (props.id === data.id) {
        setWidth(data.width)
        setHeight(data.height)
      }
    }

    const handleTextSize = (data) => {
      if (props.id === data.id) {
        setFontSize(data.fontSize)
      }
    }
    socket.on('TextSizeChange:server', handleTextSize)
    socket.on('resize:server', handleResize)
    socket.on('BoxTextChange:server', handleBoxText)

    return () => {
      socket.off('resize:server', handleResize)
      socket.off('BoxTextChange:server', handleBoxText)
      socket.off('TextSizeChange:server', handleTextSize)
    }
  }, [props.data, props.id])

  return (
    <>
      <Handle type="target" position={Position.Top} id="b" />
      <Label htmlFor="text">
        <NodeResizer
          isVisible={props.selected}
          color="#d6921e"
          minWidth={145}
          minHeight={42}
          onResize={(event, dimensions) => {
            setWidth(dimensions.width)
            setHeight(dimensions.height)
            const data = {
              id: props.id,
              width: dimensions.width,
              height: dimensions.height,
            }
            socket.emit('resize:client', data, projectId)
          }}
        />
        <textarea
          ref={textareaRef}
          id="text"
          name="text"
          placeholder="Enter text"
          value={text}
          onContextMenu={handleContextMenu}
          // onInput={adjustHeight}
          onChange={onChange}
          spellCheck="false"
          className={`outline-none resize-none min-h-10 border rounded-lg relative border-black max-h-[80rem] font-chilanka w-36 focus-visible:ring-0 p-1 font-normal overflow-auto  text-center ${Fonts[fontSize]} `}
          style={{
            width: `${width}px` || '143px',
            height: `${height}px` || '47px',
          }}
        />
      </Label>
      <AnimatePresence>
        {popover && (
          <motion.div
            className="absolute top-[-33%] right-0 flex bg-white border rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <button
              className="hover:bg-slate-200 gap-2 p-1"
              onClick={() => handleTextChange('up')}
            >
              <MdTextIncrease size={16} />
            </button>
            <button
              className="hover:bg-slate-200 gap-2 p-1"
              onClick={() => handleTextChange('down')}
            >
              <MdTextDecrease size={16} />
            </button>
            <button
              className=" gap-2 p-1 hover:bg-slate-200"
              onClick={() =>
                navigator.clipboard.writeText(textareaRef.current.value)
              }
            >
              <TbCopy size={14} />
            </button>
            <button
              className="hover:bg-slate-200 gap-2 p-1"
              onClick={handleDelete}
            >
              <MdDeleteOutline size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  )
}

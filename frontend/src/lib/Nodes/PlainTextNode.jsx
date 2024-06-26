import { useRef, useState } from 'react'
import { MdTextIncrease } from 'react-icons/md'
import { TbCopy } from 'react-icons/tb'
import { MdTextDecrease } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { useSelector } from 'react-redux'
import socket from '@/lib/socket'
import { useReactFlow } from 'reactflow'

export default function PlainTextNode(props) {
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
  const [text, setText] = useState(props.data?.value)
  const [fontSize, setFontSize] = useState(props.data?.fontSize || 0)
  const [popover, setPopover] = useState(false)
  const InputRef = useRef(null)
  const projectId = useSelector((state) => state.project?.project?.project._id)

  const handleChangeText = () => {
    props.data.value = InputRef.current.value
    setText(props.data.value)
    const data = {
      id: props.id,
      text: props.data.value,
    }
    socket.emit('PlainTextChange:client', data, projectId, (response) => {
      console.log(response)
    })
  }

  function adjustHeight() {
    const element = InputRef.current
    if (element) {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight}px`
      element.style.width = 'auto'
      element.style.width = `${element.scrollWidth}px`
    }
  }

  useEffect(adjustHeight, [fontSize])

  const handleDelete = () => {
    const data = { id: props.id }
    socket.emit('deleteNode:client', data, projectId, (response) => {
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
    const handleTextChange = (data) => {
      console.log('reached to all in room')
      if (props.id === data.id) {
        setText(data.text)
        props.data.value = data.text
      }
    }

    const handleTextSize = (data) => {
      if (props.id === data.id) {
        setFontSize(data.fontSize)
      }
    }

    socket.on('PlainTextChange:server', handleTextChange)
    socket.on('TextSizeChange:server', handleTextSize)

    return () => {
      socket.off('PlainTextChange:server', handleTextChange)
      socket.off('TextSizeChange:server', handleTextSize)
    }
  }, [props.data, props.id])

  return (
    <>
      <div
        className={`${
          InputRef?.current?.value.trim() ? '' : 'border'
        } max-h-[80rem]  rounded`}
      >
        <input
          ref={InputRef}
          id="text"
          name="text"
          onContextMenu={(e) => {
            e.preventDefault()
            setPopover((prev) => !prev)
          }}
          value={text}
          placeholder="Enter Text"
          onChange={handleChangeText}
          onInput={adjustHeight}
          className={`border-none font-chilanka outline-none w-36 focus-visible:ring-0 font-normal bg-transparent overflow-auto text-center resize-none ${Fonts[fontSize]}`}
        />
        <AnimatePresence>
          {popover && (
            <motion.div
              className="absolute top-[-80%] right-0 flex bg-white border rounded"
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
                  navigator.clipboard.writeText(InputRef.current.value)
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
      </div>
    </>
  )
}

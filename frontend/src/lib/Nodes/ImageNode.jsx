import { useState } from 'react'
import { NodeResizer } from 'reactflow'
import { AnimatePresence, motion } from 'framer-motion'
import { MdDeleteOutline } from 'react-icons/md'
import socket from '@/lib/socket'
import { useSelector } from 'react-redux'
import { useReactFlow } from 'reactflow'

const ImageNode = (props) => {
  const reactFlow = useReactFlow()
  const projectId = useSelector((state) => state.project?.project?.project._id)
  const [imageWidth, setImageWidth] = useState(props.width || 'auto')
  const [imageHeight, setImageHeight] = useState(props.height || 'auto ')
  const [popover, setPopover] = useState(false)

  const handleDelete = () => {
    reactFlow.setNodes((nodes) => nodes.filter((node) => node.id !== props.id))
    socket.emit('deleteNode:client', props.id, projectId, (response) => {
      console.log(response)
    })
  }

  return (
    <>
      <NodeResizer
        isVisible={props.selected}
        color="#d6921e"
        minWidth={100}
        minHeight={100}
        keepAspectRatio="true"
        onResize={(width, height) => {
          setImageWidth(props.width)
          setImageHeight(props.height)
        }}
      />
      {props.data?.imageSrc && (
        <img
          src={props.data?.imageSrc}
          alt="img"
          onContextMenu={(e) => {
            e.preventDefault()
            setPopover((prev) => !prev)
          }}
          className="rounded-lg "
          style={{ width: imageWidth, height: imageHeight }}
        />
      )}
      <AnimatePresence>
        {popover && (
          <motion.div
            className="absolute left-0 top-0 flex bg-white border rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <button
              onClick={handleDelete}
              className="hover:bg-slate-200 gap-2 p-1"
            >
              <MdDeleteOutline size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageNode

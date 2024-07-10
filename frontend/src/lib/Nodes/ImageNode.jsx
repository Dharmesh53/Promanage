import { useState } from 'react'
import axios from 'axios'
import { NodeResizer } from 'reactflow'
import { AnimatePresence, motion } from 'framer-motion'
import { MdDeleteOutline } from 'react-icons/md'
import socket from '@/lib/socket'
import { useSelector } from 'react-redux'
import { useReactFlow } from 'reactflow'
import { useEffect } from 'react'

const ImageNode = (props) => {
  const reactFlow = useReactFlow()
  const projectId = useSelector((state) => state.project?.project?.project._id)
  const [imageWidth, setImageWidth] = useState(props.data.width || 'auto')
  const [imageHeight, setImageHeight] = useState(props.data.height || 'auto ')
  const [popover, setPopover] = useState(false)

  const handleDelete = async () => {
    reactFlow.setNodes((nodes) => nodes.filter((node) => node.id !== props.id))
    const data = {
      id: props.id,
    }

    const segments = props?.data?.imageSrc.split('/')
    const key = segments.slice(-3).join('/')

    await axios.delete(`https://promanage-backend-i7zo.onrender.com/api/aws/delete/${key}`)
    socket.emit('deleteNode:client', data, projectId, (response) => {
      console.log(response)
    })
  }

  useEffect(() => {
    const handleResize = (data) => {
      if (props.id === data.id) {
        setImageWidth(data.width)
        setImageHeight(data.height)
      }
    }
    socket.on('resize:server', handleResize)
    return () => {
      socket.off('resize:server', handleResize)
    }
  }, [props.id])

  return (
    <>
      <NodeResizer
        isVisible={props.selected}
        color="#d6921e"
        minWidth={100}
        minHeight={100}
        keepAspectRatio="false"
        onResize={(event, params) => {
          const data = {
            id: props.id,
            width: params.width,
            height: params.height,
          }
          setImageWidth(params.width)
          setImageHeight(params.height)
          socket.emit('resize:client', data, projectId, (response) => {
            console.log(response)
          })
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

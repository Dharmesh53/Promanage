import { useEffect, useState } from 'react'
import socket from '@/lib/socket'

const useSocketHandlers = (user, projectId, setNodes, setEdges) => {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [userCursors, setUserCursors] = useState({})

  useEffect(() => {
    socket.emit('joinRoom:client', user.email, projectId, (response) => {
      console.log(response)
    })

    const handleJoinRoom = (onlineUsersArray) => {
      onlineUsersArray = onlineUsersArray.filter(
        (email) => email !== user.email
      )
      setOnlineUsers(onlineUsersArray)
    }

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

    const handleUpdateEdges = (edges) => setEdges(edges)

    const handleNewNode = (node) => setNodes((prev) => [...prev, node])

    const handleMouseMove = (data) => {
      setUserCursors((prev) => ({
        ...prev,
        [data.email]: data.position,
      }))
    }

    socket.on('leaveRoom:server', handleJoinRoom)
    socket.on('joinRoom:server', handleJoinRoom)
    socket.on('nodeMove:server', handleNodeMove)
    socket.on('newNode:server', handleNewNode)
    socket.on('deleteNode:server', handleDeleteNode)
    socket.on('loadNodesAndEdges', handleLoadNodesAndEdges)
    socket.on('updateEdges:server', handleUpdateEdges)
    socket.on('mouseMove:server', handleMouseMove)

    return () => {
      socket.emit('leaveRoom:client', user.email, projectId)

      socket.off('joinRoom:server', handleJoinRoom)
      socket.off('loadNodesAndEdges', handleLoadNodesAndEdges)
      socket.off('nodeMove:server', handleNodeMove)
      socket.off('updateEdges:server', handleUpdateEdges)
      socket.off('deleteNode:server', handleDeleteNode)
      socket.off('newNode:server', handleNewNode)
      socket.off('mouseMove:server', handleMouseMove)
    }
  }, [user.email, projectId, setNodes, setEdges])

  return [onlineUsers, userCursors, setUserCursors]
}

export default useSocketHandlers

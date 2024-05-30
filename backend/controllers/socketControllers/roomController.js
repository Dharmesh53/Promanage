const Project = require("../../models/project");

const handleRooms = (socket, io) =>  {
  
  socket.on("joinRoom", async (projectId, callback) => {
    try {
      const rooms = Array.from(socket.rooms); 
      rooms.forEach(room => {
        if (room !== socket.id && room !== projectId) {
          socket.leave(room);
        }
      }); 
      socket.join(projectId)
      const res = await Project.findById(projectId);
      const data = {
        roomNodes : res.roomNodes || [],
        roomEdges : res.roomEdges || []
      }
      if (res) socket.emit('loadNodesAndEdges', data);
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });

}
// io.sockets.adapter.rooms.get(projectId) // fetch clients in a room 
 module.exports = { handleRooms }

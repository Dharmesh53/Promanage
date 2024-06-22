const Project = require("../../models/project");

const usersInRooms = {};

const handleRooms = (socket, io) => {
  socket.on("joinRoom:client", async (email, projectId, callback) => {
    try {
      const rooms = Array.from(socket.rooms);

      rooms.forEach((room) => {
        if (room !== socket.id && room !== projectId) {
          socket.leave(room);
        }
      });

      if (!usersInRooms[projectId]) {
        usersInRooms[projectId] = [];
      }

      if (!usersInRooms[projectId].includes(email)) {
        usersInRooms[projectId].push(email);
      }

      console.log(usersInRooms);
      socket.join(projectId);
      console.log(socket.rooms, email);

      const res = await Project.findById(projectId);
      const data = {
        roomNodes: res.roomNodes || [],
        roomEdges: res.roomEdges || [],
      };

      io.in(projectId).emit("joinRoom:server", usersInRooms[projectId]);
      if (res) socket.emit("loadNodesAndEdges", data);
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });
  socket.on("mouseMove:client", async (data, projectId) => {
    console.log(data);
    socket.to(projectId).emit("mouseMove:server", data);
  });
};
// io.sockets.adapter.rooms.get(projectId) // fetch clients in a room
module.exports = { handleRooms };

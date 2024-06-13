const Project = require("../../models/project");

const handleNodes = (socket, io) => {
  socket.on("newNode", async (node, projectId, callback) => {
    try {
      const res = await Project.findOneAndUpdate(
        { _id: projectId },
        { $push: { roomNodes: node } },
        { new: true }
      );
      if (res) callback("done");
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });

  socket.on("deleteNode", async (nodeId, projectId, callback) => {
    try {
      const res = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { roomNodes: { id: nodeId } } }
      );
      socket.to(projectId).emit("deleteNode:server", nodeId);
      if (res) callback("done", res);
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });

  socket.on("updateEdges:client", async (edges, projectId, callback) => {
    try {
      console.log(edges);
      const res = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: { roomEdges: edges } }
      );
      socket.to(projectId).emit("updateEdges:server", edges);
      if (res) callback("done with edges");
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });

  socket.on("nodeMove:client", async (node, projectId, callback) => {
    try {
      socket.to(projectId).emit("nodeMove:server", node);
    } catch (e) {
      callback(e);
    }
  });

  socket.on("BoxTextChange:client", async (data, projectId, callback) => {
    try {
      socket.to(projectId).emit("BoxTextChange:server", data);
      callback("reached server ");
    } catch (e) {
      callback(e);
    }
  });

  socket.on("PlainTextChange:client", async (data, projectId, callback) => {
    try {
      socket.to(projectId).emit("PlainTextChange:server", data);
      callback("reached server ");
    } catch (e) {
      callback(e);
    }
  });

  socket.on("resize:client", async (data, projectId, callback) => {
    try {
      socket.to(projectId).emit("resize:server", data);
    } catch (e) {
      callback(e);
    }
  });

  socket.on("colorChange:client", async (data, projectId, callback) => {
    try {
      socket.to(projectId).emit("colorChange:server", data);
    } catch (e) {
      callback(e);
    }
  });
};

module.exports = { handleNodes };

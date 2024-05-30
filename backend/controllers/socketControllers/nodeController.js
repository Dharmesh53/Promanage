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
        { $pull: { roomNodes: { id : nodeId } } }
      );
      if (res) callback("done",res);
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });
  
  socket.on("updateEdges", async (edges, projectId, callback) => {
    try {
      const res = await Project.findOneAndUpdate(
        { _id: projectId }, 
        { $set: { roomEdges : edges } }
      );
      if (res) callback("done with edges");
      else throw Error("Something went wrong");
    } catch (error) {
      callback(error);
    }
  });

  socket.on('movement', async(nodes, edges, projectId) => {
    try{
      const data= {
        roomNodes : nodes,
        roomEdges : edges
      }
      console.log(socket.rooms, "called")
      socket.to(projectId).emit('loadNodesAndEdges', data) 
    }
    catch(e) {
      callback(e);
    }
  })
};

module.exports = { handleNodes };

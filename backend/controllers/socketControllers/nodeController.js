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

  socket.on('nodeMove:client', async(node, projectId, callback) => {
    try{
      socket.to(projectId).emit('nodeMove:server', node);
    }
    catch(e) {
      callback(e);
    }
  })

  socket.on('BoxTextChange:client', async(text, projectId, callback) => {
    try{
      socket.to(projectId).emit('BoxTextChange:server', text);
      callback('reached server '); 
    } catch(e) {
      callback(e);
    }
  })
  
  socket.on('PlainTextChange:client', async(text, projectId, callback) => {
    try{
      socket.to(projectId).emit('PlainTextChange:server', text);
      callback('reached server '); 
    } catch(e) {
      callback(e);
    }
  })
};

module.exports = { handleNodes };

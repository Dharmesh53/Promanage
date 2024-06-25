const Project = require("../../models/project");
const debounce = require("../../utils/debouce");

const handleNodes = (socket, io) => {
  // Handle new node creation
  socket.on("newNode:client", async (node, projectId, callback) => {
    try {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $push: { roomNodes: node } },
        { new: true },
      );
      socket.to(projectId).emit("newNode:server", node);
      if (updatedProject) {
        callback("done");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      callback(error);
    }
  });

  // Handle node deletion
  socket.on("deleteNode:client", async (nodeId, projectId, callback) => {
    try {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { roomNodes: { id: nodeId } } },
      );
      socket.to(projectId).emit("deleteNode:server", nodeId);
      if (updatedProject) {
        callback("done", updatedProject);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      callback(error);
    }
  });

  // Handle edge updates
  socket.on("updateEdges:client", async (edges, projectId, callback) => {
    try {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: { roomEdges: edges } },
      );
      socket.to(projectId).emit("updateEdges:server", edges);
      if (updatedProject) {
        callback("done with edges");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      callback(error);
    }
  });

  // Handle node movement
  socket.on("nodeMove:client", async (node, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, node);
      socket.to(projectId).emit("nodeMove:server", node);
    } catch (error) {
      callback(error);
    }
  });

  // Handle box text changes
  socket.on("BoxTextChange:client", async (data, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, data);
      socket.to(projectId).emit("BoxTextChange:server", data);
      callback("reached server ");
    } catch (error) {
      callback(error);
    }
  });

  // Handle plain text changes
  socket.on("PlainTextChange:client", async (data, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, data);
      socket.to(projectId).emit("PlainTextChange:server", data);
      callback("reached server ");
    } catch (error) {
      callback(error);
    }
  });

  // Handle node resizing
  socket.on("resize:client", async (data, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, data);
      socket.to(projectId).emit("resize:server", data);
    } catch (error) {
      callback(error);
    }
  });

  // Handle node color changes
  socket.on("colorChange:client", async (data, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, data);
      socket.to(projectId).emit("colorChange:server", data);
    } catch (error) {
      callback(error);
    }
  });

  // Handle text size changes
  socket.on("TextSizeChange:client", async (data, projectId, callback) => {
    try {
      handleSaveNodeProps(projectId, data);
      socket.to(projectId).emit("TextSizeChange:server", data);
    } catch (error) {
      callback(error);
    }
  });
};

const handleSaveNodeProps = debounce(async (projectId, node) => {
  try {
    const updateFields = {};

    if (node.position !== undefined) {
      updateFields["roomNodes.$.position"] = node.position;
    }

    if (node.width !== undefined) {
      updateFields["roomNodes.$.data.width"] = node.width;
    }

    if (node.height !== undefined) {
      updateFields["roomNodes.$.data.height"] = node.height;
    }

    if (node.color !== undefined) {
      updateFields["roomNodes.$.data.color"] = node.color;
    }

    if (node.text !== undefined) {
      updateFields["roomNodes.$.data.value"] = node.text;
    }

    if (node.fontSize !== undefined) {
      updateFields["roomNodes.$.data.fontSize"] = node.fontSize;
    }

    await Project.findOneAndUpdate(
      { _id: projectId, "roomNodes.id": node.id },
      { $set: updateFields },
    );
  } catch (error) {
    console.log(error.message);
  }
}, 500);

module.exports = { handleNodes };

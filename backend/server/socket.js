const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("new user connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
};

module.exports = configureSocket;

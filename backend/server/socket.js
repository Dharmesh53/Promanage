const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("new user connected: ", socket.id);

    setInterval(() => {
      console.log("connection is smoothly going ");
    }, 120000);

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
};

module.exports = configureSocket;

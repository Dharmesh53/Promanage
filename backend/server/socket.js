const { handleRooms } = require('../controllers/socketControllers/roomController');
const { handleNodes } = require('../controllers/socketControllers/nodeController');

const configureSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("new user connected: ", socket.id);
        
        socket.on("disconnect", () => {
            console.log("user disconnected: ", socket.id);
        });

        handleRooms(socket, io);
        handleNodes(socket, io);
    });
};

module.exports = configureSocket;

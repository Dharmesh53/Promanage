require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { Server } = require("socket.io");
const connectToDB = require("./utils/connectToDB");
const configureRoutes = require("./server/express");
const configureSocket = require("./server/socket");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json()); //order matter in middlewares
app.use(morgan(":status :method :url - :response-time ms "));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

configureRoutes(app);
configureSocket(io);

connectToDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

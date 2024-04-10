require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectToDB = require("./utils/connectToDB");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json()); //order matter in middlewares
app.use("/api", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/team", teamRoutes);

connectToDB().then(() => {
  app.listen(5000, () => {
    console.log("Listening to 5000");
  });
});

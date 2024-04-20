const userRoutes = require("../routes/userRoutes");
const projectRoutes = require("../routes/projectRoutes");
const teamRoutes = require("../routes/teamRoutes");
const taskRoutes = require("../routes/taskRoutes");

const configureRoutes = (app) => {
  app.use("/api", userRoutes);
  app.use("/api/project", projectRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/task", taskRoutes);
};

module.exports = configureRoutes;

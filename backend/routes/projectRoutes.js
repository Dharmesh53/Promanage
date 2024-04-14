const express = require("express");
const {
  createProject,
  getProject,
  updateProject,
  addNewTeam,
  createProjectTask,
  updateProjectTask,
  deleteProjectTeam,
} = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/:id", getProject);

router.post("/create", verifyToken, createProject);
router.post("/createTask", createProjectTask);
router.post("/addTeam/:id", addNewTeam);

router.put("/updateTask/:id", updateProjectTask);
router.put("/updateProject/:id", updateProject);

router.delete("/removeTeam/:pid/:tid", deleteProjectTeam);

module.exports = router;

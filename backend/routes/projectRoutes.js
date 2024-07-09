const express = require("express");
const {
  createProject,
  getProject,
  updateProject,
  addNewTeam,
  createProjectTask,
  updateProjectTask,
  updateProjectFiles,
  deleteProject,
  deleteProjectTeam,
} = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/:id", verifyToken, getProject);

router.post("/create", createProject);
router.post("/createTask", createProjectTask);
router.post("/addTeam/:id", addNewTeam);

router.put("/updateTask/:id", updateProjectTask);
router.put("/updateProject/:id", updateProject);
router.put("/newFiles/:id", updateProjectFiles);

router.delete("/removeTeam/:pid/:tid", deleteProjectTeam);
router.delete("/delete/:id", deleteProject);

module.exports = router;

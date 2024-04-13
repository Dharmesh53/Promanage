const express = require("express");
const {
  createProject,
  getProject,
  updateProject,
  createProjectTask,
  updateProjectTask,
} = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/:id", getProject);

router.post("/create", verifyToken, createProject);
router.post("/createTask", createProjectTask);

router.put("/updateTask/:id", updateProjectTask);
router.put("/updateProject/:id", updateProject);

module.exports = router;

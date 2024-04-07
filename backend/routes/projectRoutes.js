const express = require("express");
const {
  createProject,
  getProject,
  createProjectTask,
  updateProjectTask,
} = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/:id", getProject);

router.post("/create", verifyToken, createProject);
router.post("/createTask/:id", createProjectTask);

router.put("/updateTask/:id", updateProjectTask);

module.exports = router;

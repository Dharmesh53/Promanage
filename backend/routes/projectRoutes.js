const express = require("express");
const {
  createProject,
  getProject,
} = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.get("/:id", getProject);

module.exports = router;

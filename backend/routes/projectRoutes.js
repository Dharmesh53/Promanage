const express = require("express");
const { createProject } = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/create", createProject);

module.exports = router;

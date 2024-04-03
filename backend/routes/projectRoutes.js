const express = require("express");
const { createProject } = require("../controllers/projectController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, createProject);

module.exports = router;

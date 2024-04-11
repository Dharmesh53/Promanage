const express = require("express");

const { getTask, updateTask } = require("../controllers/taskController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/", verifyToken, getTask);

router.put("/updateTask/:id", updateTask);

module.exports = router;

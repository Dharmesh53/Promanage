const express = require("express");

const { getTask, updateTask, deleteTask } = require("../controllers/taskController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/", verifyToken, getTask);

router.put("/updateTask/:id", updateTask);

router.delete("/deleteTask/:tid/:uid", deleteTask);

module.exports = router;

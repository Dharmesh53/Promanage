const express = require("express");
const {
  signup,
  login,
  getUser,
  logout,
  getUserTeams,
  updateUserTasks,
} = require("../controllers/userController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/user", verifyToken, getUser);
router.get("/getUserTeams", verifyToken, getUserTeams);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/user/updateTask", verifyToken, updateUserTasks);

module.exports = router;

const express = require("express");
const {
  signup,
  login,
  getUser,
  logout,
  getTeams,
} = require("../controllers/userController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.post("/logout", logout);
router.get("/getTeams", verifyToken, getTeams);

module.exports = router;

const express = require("express");
const {
  signup,
  login,
  getUser,
  logout,
} = require("../controllers/userController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.post("/logout", logout);

module.exports = router;

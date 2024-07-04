const express = require("express");
const {
  getFile,
  putFile,
  deleteFile,
} = require("../controllers/awsController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/get/*", verifyToken, getFile);

router.post("/put", verifyToken, putFile);

router.delete("/delete/*", verifyToken, deleteFile);

module.exports = router;

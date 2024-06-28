const express = require("express");
const {
  getImage,
  putImage,
  deleteImage,
} = require("../controllers/awsController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/get/*", verifyToken, getImage);

router.post("/put", verifyToken, putImage);

module.exports = router;

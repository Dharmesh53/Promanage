const express = require("express");
const { getFile, putFile } = require("../controllers/awsController");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/get/*", verifyToken, getFile);

router.post("/put", verifyToken, putFile);

module.exports = router;

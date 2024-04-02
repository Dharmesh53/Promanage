const express = require("express");

const { addMembers } = require("../controllers/teamController");

const router = express.Router();

router.post("/create", addMembers);

module.exports = router;

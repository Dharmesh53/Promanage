const express = require("express");

const { createTeam } = require("../controllers/teamController");

const router = express.Router();

router.post("/create", createTeam);

module.exports = router;

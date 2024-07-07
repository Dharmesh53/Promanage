const express = require("express");

const {
  createTeam,
  getTeam,
  deleteUserfromTeam,
} = require("../controllers/teamController");

const router = express.Router();

router.get("/get/:id", getTeam);

router.post("/create", createTeam);

router.delete("/delete/:pid/:uid", deleteUserfromTeam);

module.exports = router;

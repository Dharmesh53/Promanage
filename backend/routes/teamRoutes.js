const express = require("express");

const {
  createTeam,
  getTeam,
  deleteUserfromTeam,
  changeCreator,
  addMembers,
  deleteTeam,
} = require("../controllers/teamController");

const router = express.Router();

router.get("/get/:id", getTeam);

router.post("/create", createTeam);
router.post("/change-Creator", changeCreator);

router.put("/add-members", addMembers);

router.delete("/delete/:tid/:uid", deleteUserfromTeam);
router.delete("/delete/:tid", deleteTeam);

module.exports = router;

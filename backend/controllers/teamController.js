const Team = require("../models/team");
const User = require("../models/user");
const mongoose = require("mongoose");

const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // const team = await Team.findById(id).populate("users", "name email");

    const team = await Team.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "members",
          pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
        },
      },
    ]);
    return res.status(200).json({ team });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { title, members, createdBy } = req.body;

    const memberIds = [];

    for (const member of members) {
      const user = await User.findOne({ email: member });
      if (user) {
        memberIds.push(user._id);
        emailSender(user.name, title);
      }
    }

    const team = new Team({
      title: title,
      users: memberIds,
      createdBy,
    });

    await team.save();

    for (const id of memberIds) {
      await User.findByIdAndUpdate(id, {
        $push: { teams: team._id },
      });
    }
    return res.status(200).json({ msg: "done" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const deleteUserfromTeam = async (req, res) => {
  try {
    const { pid, uid } = req.params;
    console.lof(pid, uid);
    return res.status(200).json({ msg: "deleted" });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.createTeam = createTeam;
exports.getTeam = getTeam;
exports.deleteUserfromTeam = deleteUserfromTeam;

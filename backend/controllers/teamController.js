const Team = require("../models/team");
const User = require("../models/user");

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

exports.createTeam = createTeam;

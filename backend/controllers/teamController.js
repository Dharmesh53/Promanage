const Team = require("../models/team");
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");
const mongoose = require("mongoose");
const { emailSender } = require("../emails/newTeamMemberEmail");

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

const addMembers = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teamId, newMembers, title } = req.body;
    const members = [];

    for (const member of newMembers) {
      const user = await User.findOneAndUpdate(
        { email: member },
        { $addToSet: { teams: teamId } },
        { new: true },
      ).session(session);

      if (user) {
        members.push({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
        emailSender(user.name, title);
      }
    }

    await Team.findByIdAndUpdate(teamId, {
      $addToSet: { users: { $each: members.map((member) => member._id) } },
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ members });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ msg: error.message });
  }
};

const createTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, members, createdBy } = req.body;

    const memberIds = [];

    for (const member of members) {
      const user = await User.findOne({ email: member }).session(session);
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
      }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ msg: "done" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const deleteUserfromTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tid, uid } = req.params;

    await Team.findByIdAndUpdate(
      tid,
      {
        $pull: { users: uid },
      },
      { session },
    );

    await User.findByIdAndUpdate(
      uid,
      {
        $pull: { teams: tid },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ msg: "Successfully removed that bastard" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ msg: error.message });
  }
};

const changeCreator = async (req, res) => {
  try {
    const { teamId, newInCharge } = req.body;

    console.log(teamId, newInCharge);

    await Team.findByIdAndUpdate(teamId, {
      createdBy: newInCharge,
    });

    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// that's one hell of an code
const deleteTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tid } = req.params;

    const team = await Team.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(tid) } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
          pipeline: [{ $project: { email: 1, _id: 0 } }],
        },
      },
      {
        $project: {
          title: 1,
          projects: 1,
          users: { $map: { input: "$users", as: "user", in: "$$user.email" } },
        },
      },
    ]).session(session);

    //team always will be the size of 1
    const assignee = {
      name: "Not Assigned",
      email: "---",
      team: null,
    };

    for (const projectId of team[0].projects) {
      const project = await Project.findById(
        projectId,
        { tasks: 1 },
        { session },
      );

      if (project) {
        await Promise.all(
          project.tasks.map(async (taskId) => {
            const task = await Task.findById(taskId);

            if (String(task.assignee.team) == tid) {
              await User.findOneAndUpdate(
                { email: task.assignee.email },
                {
                  $pull: { tasks: task._id },
                },
                { session },
              );
              task.assignee = { ...assignee };
              await task.save({ session });
            }
          }),
        );
      }
    }

    for (const emails of team[0].users) {
      await User.findOneAndUpdate(
        { email: emails },
        {
          $pull: { teams: tid },
        },
        { session },
      );
    }

    await Team.findByIdAndDelete(tid, { session });

    await session.commitTransaction();

    return res.status(200).json({ msg: "done" });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({ msg: error.message });
  }
};

exports.createTeam = createTeam;
exports.getTeam = getTeam;
exports.deleteUserfromTeam = deleteUserfromTeam;
exports.changeCreator = changeCreator;
exports.addMembers = addMembers;
exports.deleteTeam = deleteTeam;

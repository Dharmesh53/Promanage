const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const Cache = require("../utils/Cache");

const createProject = async (req, res) => {
  try {
    const id = req.id;
    const { title, teamId } = req.body;
    const project = new Project({
      title,
      teams: [teamId],
    });
    await project.save();
    await User.findByIdAndUpdate(id, { $push: { projects: project._id } });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id)
      .populate({
        path: "teams",
        populate: {
          path: "users",
        },
      })
      .populate("tasks");
    return res.status(200).json({ project: project });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, progess } = req.body;
    console.log(id, title, description, progess);
    await Project.findByIdAndUpdate(id, {
      title,
      description,
      progess,
    });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(200).json({ msg: error.message });
  }
};

const addNewTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const { teamId } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (project.teams.includes(teamId)) {
      return res.status(400).json({ msg: "Team already exists in project" });
    }

    await Project.findByIdAndUpdate(id, { $addToSet: { teams: teamId } });
    return res.status(200).json({ msg: "Team added to project" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createProjectTask = async (req, res) => {
  try {
    const id = req.query.id;
    const { title, status, assigneeObject, due, priority, createdBy } =
      req.body;
    const taskData = {
      title,
      status,
      assignee: assigneeObject,
      due,
      priority,
      createdBy,
    };

    if (id) taskData.project = id;

    const task = new Task(taskData);
    await task.save();
    await User.findOneAndUpdate(
      { email: assigneeObject.email },
      { $push: { tasks: task._id } }
    );
    if (id) {
      await Project.findByIdAndUpdate(id, {
        $push: { tasks: task._id },
      });
    }
    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProjectTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    const cards = req.body;
    const project = await Project.findById(id).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "Project not found" });
    }

    const newCards = cards.map((card) => card._id);
    let deletedCards = project.tasks.filter(
      (task) => !newCards.includes(String(task))
    );
    deletedCards = deletedCards.map((task) => String(task));

    let remainingCards = project.tasks.filter((task) =>
      newCards.includes(String(task))
    );
    remainingCards = remainingCards.map((task) => String(task));

    project.tasks = [...remainingCards];

    for (let i = 0; i < deletedCards.length; i++) {
      const deletedCard = await Task.findById(
        new ObjectId(deletedCards[i])
      ).session(session);
      if (!deletedCard) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ msg: `Task with ID ${deletedCards[i]} not found` });
      }
      const email = deletedCard.assignee.email;
      let user = await User.findOne({ email }).session(session);
      let updatedTasks = user.tasks.filter(
        (task) => String(task) !== deletedCards[i]
      );
      user.tasks = [...updatedTasks];
      await user.save();
      await Task.findByIdAndDelete(deletedCards[i]).session(session);
    }

    for (let i = 0; i < remainingCards.length; i++) {
      const completeCard = cards.find((card) =>
        remainingCards.includes(String(card._id))
      );
      delete completeCard._id;
      await Task.findOneAndReplace(
        { _id: remainingCards[i] },
        completeCard
      ).session(session);
    }

    await project.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ msg: "done" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProjectTeam = async (req, res) => {
  try {
    const { pid: projectId, tid: teamId } = req.params;
    const code = req.query.code;
    const project = await Project.findById(projectId);
    const team = await Team.findById(teamId).populate("users");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (!project.teams.includes(teamId)) {
      return res.status(400).json({ msg: "Team not found in project" });
    }
    let teamMembers = team.users.map((user) => user.email);

    if (code == 1) {
      project.tasks.forEach(async (task) => {
        let taskDetails = await Task.findById(task);
        if (
          taskDetails?.assignee?.email &&
          teamMembers.includes(taskDetails.assignee.email)
        ) {
          await Task.findByIdAndDelete(task);
        }
      });
    }
    if (code == 2) {
      project.tasks.forEach(async (task) => {
        let taskDetails = await Task.findById(task);
        if (teamMembers.includes(taskDetails.assignee.email)) {
          taskDetails.assignee = { name: "", email: "" };
          await taskDetails.save();
        }
      });
    }

    await Project.findByIdAndUpdate(projectId, { $pull: { teams: teamId } });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.createProject = createProject;
exports.getProject = getProject;
exports.updateProject = updateProject;
exports.createProjectTask = createProjectTask;
exports.updateProjectTask = updateProjectTask;
exports.addNewTeam = addNewTeam;
exports.deleteProjectTeam = deleteProjectTeam;

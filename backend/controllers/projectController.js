const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

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

const createProjectTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, status, assigneeObject, due, priority, project, createdBy } =
      req.body;
    const task = new Task({
      title,
      status,
      assignee: assigneeObject,
      due,
      priority,
      project,
      createdBy,
    });
    await task.save();
    await User.findOneAndUpdate(
      { email: assigneeObject.email },
      { $push: { tasks: task._id } }
    );
    await Project.findByIdAndUpdate(id, {
      $push: { tasks: task._id },
    });
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

exports.createProject = createProject;
exports.getProject = getProject;
exports.createProjectTask = createProjectTask;
exports.updateProjectTask = updateProjectTask;

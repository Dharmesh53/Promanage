const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require("mongoose");

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
    const { title, status, assigneeObject, due, priority } = req.body;
    const task = new Task({
      title,
      status,
      assignee: assigneeObject,
      due,
      priority,
    });
    await task.save();
    await Project.findByIdAndUpdate(id, { $push: { tasks: task._id } });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProjectTask = async (req, res) => {
  try {
    const id = req.params.id;
    const cards = req.body;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    const newCards = cards.map((card) => card._id);
    const deletedCards = project.tasks.filter(
      (task) => !newCards.includes(String(task))
    );
    let remainingCards = project.tasks.filter((task) =>
      newCards.includes(String(task))
    );
    for (let i = 0; i < deletedCards.length; i++) {
      await Task.findByIdAndDelete(deletedCards[i]);
    }
    project.tasks = [...remainingCards];
    await project.save();
    remainingCards = remainingCards.map((task) => String(task));
    for (let i = 0; i < remainingCards.length; i++) {
      const completeCard = cards.find((card) =>
        remainingCards.includes(String(card._id))
      );
      delete completeCard._id;
      await Task.findOneAndReplace({ _id: remainingCards[i] }, completeCard);
    }
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.createProject = createProject;
exports.getProject = getProject;
exports.createProjectTask = createProjectTask;
exports.updateProjectTask = updateProjectTask;

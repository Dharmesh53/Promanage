const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

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
    const newCards = cards.map((card) => card._id);
    console.log(newCards);
    // await Task.findByIdAndUpdate(cards[i]._id);
    // await Project.findByIdAndUpdate(id, { $set: { tasks: cards } });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.createProject = createProject;
exports.getProject = getProject;
exports.createProjectTask = createProjectTask;
exports.updateProjectTask = updateProjectTask;

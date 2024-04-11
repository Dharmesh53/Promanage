const Task = require("../models/task");
const User = require("../models/user");

const getTask = async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findById(id).populate("tasks");
    return res.status(200).json({ tasks: user.tasks });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, assignee, priority, due, progess } = req.body;
    await Task.findByIdAndUpdate(id, {
      title,
      description,
      assignee,
      priority,
      due,
      progess,
    });
    return res.status(200).json({ msg: "done" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateTask = updateTask;
exports.getTask = getTask;

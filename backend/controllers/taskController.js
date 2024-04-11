const Task = require("../models/task");

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

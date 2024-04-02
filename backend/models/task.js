const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  assignee: { type: Schema.Types.ObjectId, ref: "User" },
  status: String,
  progess: {
    type: String,
    enum: ["On Track", "Off track", "At risk", ""],
    default: "",
  },
  due: Date,
  start: Date,
  priority: { type: String, enum: ["Low", "Medium", "High", ""] },
  subtasks: [
    {
      title: String,
      assignee: { type: Schema.Types.ObjectId, ref: "User" },
      description: String,
      due: Date,
      progess: {
        type: String,
        enum: ["On Track", "Off track", "At risk", ""],
        default: "",
      },
    },
  ],
});

module.exports = model("Task", taskSchema);

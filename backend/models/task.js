const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const assigneeSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    team: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  { _id: false },
);

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  assignee: { type: assigneeSchema, required: true },
  status: String,
  progess: {
    type: String,
    enum: ["On track", "Off track", "At risk", ""],
    default: "",
  },
  due: Date,
  start: Date,
  priority: { type: String, enum: ["Low", "Medium", "High", ""] },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  createdBy: {
    type: String,
    required: true,
  },
});

module.exports = model("Task", taskSchema);

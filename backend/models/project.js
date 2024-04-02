const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  members: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, default: "member" },
    },
  ],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  files: [String],
});

module.exports = model("Project", projectSchema);

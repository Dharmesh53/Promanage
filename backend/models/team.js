const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const teamSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: {
    type: String,
    required: true,
  },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

module.exports = model("Team", teamSchema);

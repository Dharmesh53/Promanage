const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: String,
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = model("User", userSchema);

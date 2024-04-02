const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const teamSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Team", teamSchema);

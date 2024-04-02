const User = require("../models/user");
const Project = require("../models/project");

const createProject = async (req, res) => {
  return res.status(200).json({ msg: "hello" });
};

exports.createProject = createProject;

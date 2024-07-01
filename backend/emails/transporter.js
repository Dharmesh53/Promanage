const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_ID,
    pass: process.env.EMAIL_SENDER_PASS,
  },
});

module.exports = transporter;

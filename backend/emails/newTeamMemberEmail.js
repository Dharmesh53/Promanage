const nodemailer = require("nodemailer");

function newMemberEmailTemplate(memberName, teamName) {
  return `
    <!doctype html>
    <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            background-color: #4caf50;
            color: white;
            padding: 10px 0;
            text-align: center;
          }
          .content {
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to the Team!</h1>
          </div>
          <div class="content">
            <p>Dear ${memberName},</p>
            <p>
              You have been added to the team "<strong>${teamName}</strong>".
            </p>
            <p>We are excited to have you with us and look forward to your valuable contributions.</p>
          </div>
          <div class="footer">
            <p>Thank you,</p>
            <p>The Project Team</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

const emailSender = (memberName, teamName) => {
  try {
    const emailContent = newMemberEmailTemplate(memberName, teamName);

    const mailOptions = {
      from: "dhiru7321r@gmail.com",
      to: task.assignee.email,
      subject: "Added in a new Team",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.emailSender = emailSender;

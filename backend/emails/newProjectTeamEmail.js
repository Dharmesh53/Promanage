const transporter = require("./transporter");

function newTeamEmailTemplate(user, teamName, projectName) {
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
            <h1>New Team Added to Project</h1>
          </div>
          <div class="content">
            <p>Dear ${user},</p>
            <p>
              Your team "<strong>${teamName}</strong>" has been added to the project "<strong>${projectName}</strong>".
            </p>
            <p>We look forward to your collaboration and contributions to the project's success.</p>
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

const userEmailSender = (user, teamName, projectName) => {
  try {
    const emailContent = newTeamEmailTemplate(user, teamName, projectName);

    const mailOptions = {
      from: "dhiru7321r@gmail.com",
      to: task.assignee.email,
      subject: "Added to a new Project",
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

exports.userEmailSender = userEmailSender;

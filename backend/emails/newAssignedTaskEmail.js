const transporter = require("./transporter");

function NewTaskEmailTemplate(task, projectTitle) {
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
            <h1>New Task Assigned</h1>
          </div>
          <div class="content">
            <p>Dear ${task.assignee.name},</p>
            <p>
              A new task titled "<strong>${task.title}</strong>" has been assigned to you.
            </p>
            <p><strong>Task Details:</strong></p>
            <ul>
              <li><strong>Task Title:</strong> ${task.title}</li>
              <li><strong>Project Title:</strong> ${projectTitle}</li>
              <li>
                <strong>Due Date:</strong> ${new Date(task.due).toLocaleString()}
              </li>
              <li>
                <strong>Description:</strong> ${task.description || "No description provided."}
              </li>
              <li>
                <strong>Status:</strong> ${task.status || "No status provided."}
              </li>
              <li>
                <strong>Priority:</strong> ${task.priority || "No priority set."}
              </li>
            </ul>
            <p>Please make sure to review the task and complete it by the due date.</p>
          </div>
          <div class="footer">
            <p>Thank you,</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

const taskEmailSender = (task, projectTitle) => {
  try {
    const emailContent = NewTaskEmailTemplate(task, projectTitle);

    const mailOptions = {
      from: "dhiru7321r@gmail.com",
      to: task.assignee.email,
      subject: "New Task Assigned",
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

exports.taskEmailSender = taskEmailSender;

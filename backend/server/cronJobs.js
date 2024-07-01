const cron = require("node-cron");

const { emailSender } = require("../emails/dueTaskEmail");
const { dueTasksFetcher } = require("../controllers/taskController");

cron.schedule("0 0 * * *", async () => {
  console.log("running after every 24 hours");

  const tasks = dueTasksFetcher();

  tasks.forEach((task) => emailSender(task));
});

const app = require("../app");
const route = require("../routes/quizFromSubtitle");
app.use("/api/", route);
module.exports = app;
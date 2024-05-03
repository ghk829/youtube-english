const app = require("../app");
const route = require("../routes/subtitles");
app.use("/api/", route);
module.exports = app;
const app = require("../app");
const route = require("../routes/getVideoList");
app.use("/api/", route);
module.exports = app;
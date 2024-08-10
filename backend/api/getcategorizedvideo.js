const app = require("../app");
const route = require("../routes/getallvideo");
app.use("/api/", route);
module.exports = app;

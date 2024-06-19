const app = require("../app");
const route = require("../routes/addvideo");
app.use("/api/", route);
module.exports = app;
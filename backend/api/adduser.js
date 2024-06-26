const app = require("../app");
const route = require("../routes/adduser");
app.use("/api/", route);
module.exports = app;
const app = require("../app");
const route = require("../routes/title");
app.use("/api/", route);
module.exports = app;
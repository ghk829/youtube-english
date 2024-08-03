const app = require("../app");
const route = require("../routes/addword");
app.use("/api/", route);
module.exports = app;

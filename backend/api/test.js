const app = require("../app");
const route = require("../routes/test");
app.use("/api/", route);
module.exports = app;
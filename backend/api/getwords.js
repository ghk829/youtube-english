const app = require("../app");
const route = require("../routes/getwords");
app.use("/api/", route);
module.exports = app;

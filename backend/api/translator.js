const app = require("../app");
const route = require("../routes/translator");
app.use("/api/", route);
module.exports = app;
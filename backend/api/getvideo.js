const app = require("../app");
const route = require("../routes/getvideo");
app.use("/api/", route);
module.exports = app;

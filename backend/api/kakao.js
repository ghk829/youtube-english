const app = require("../app");
const route = require("../routes/kakao");
app.use("/api/", route);
module.exports = app;
const routes = require("express").Router();
const quiz = require("./quizFromSubtitle");
const subtitle = require("./subtitles");
const test = require("./test");
routes.use("/", quiz);
routes.use("/", subtitle);
routes.use("/", test);
module.exports = routes;
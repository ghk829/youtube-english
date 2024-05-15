const routes = require("express").Router();
const quiz = require("./quizFromSubtitle");
const subtitle = require("./subtitles");
const test = require("./test");
const translators = require("./translator");
const title = require('./title')
routes.use("/", quiz);
routes.use("/", subtitle);
routes.use("/", test);
routes.use("/", translators);
routes.use("/", title);
module.exports = routes;
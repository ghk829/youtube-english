const routes = require("express").Router();
const quiz = require("./quizFromSubtitle");
const subtitle = require("./subtitles");
const test = require("./test");
const translators = require("./translator");
const title = require('./title')
const getallvideo = require('./getallvideo')
const addvideo = require('./addvideo')
const adduser = require('./adduser')

routes.use("/", quiz);
routes.use("/", subtitle);
routes.use("/", test);
routes.use("/", translators);
routes.use("/", title);
routes.use("/", getallvideo);
routes.use("/", addvideo);
routes.use("/", adduser);
module.exports = routes;
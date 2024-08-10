const routes = require("express").Router();
const quiz = require("./quizFromSubtitle");
const subtitle = require("./subtitles");
const test = require("./test");
const translators = require("./translator");
const title = require("./title");
const getallvideo = require("./getallvideo");
const getcategorizedvideo = require("./getcatogorizedvideo");
const addvideo = require("./addvideo");
const adduser = require("./adduser");
const kakao = require("./kakao");
const addword = require("./addword");
const getwords = require("./getwords");

routes.use("/", quiz);
routes.use("/", subtitle);
routes.use("/", test);
routes.use("/", translators);
routes.use("/", title);
routes.use("/", getallvideo);
routes.use("/", getcategorizedvideo);
routes.use("/", addvideo);
routes.use("/", adduser);
routes.use("/", kakao);
routes.use("/", addword);
routes.use("/", getwords);
module.exports = routes;

const youtube_controller = require('./youtubeAPI/youtube_controller');
const quizFromSubtitle = require("express").Router();

quizFromSubtitle.post("/quizFromSubtitle", async function (req, res, next) {
    await  youtube_controller.getQuizFromSubtitles(req, res, next);
  })
  
module.exports = quizFromSubtitle;
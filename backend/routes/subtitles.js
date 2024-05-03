const youtube_controller = require('./youtubeAPI/youtube_controller');
const subtitles = require("express").Router();

subtitles.post("/subtitles", async function (req, res, next) {
  await  youtube_controller.getSubtitles(req, res, next)
})

module.exports = subtitles;
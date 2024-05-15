const youtube_controller = require('./youtubeAPI/youtube_controller');
const title = require("express").Router();

title.post("/title", async function (req, res, next) {
  await  youtube_controller.getTitle(req, res, next)
})

module.exports = title;
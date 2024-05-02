const youtube_controller = require('../youtubeAPI/youtube_controller');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  await youtube_controller.getSubtitles(req, res);
};

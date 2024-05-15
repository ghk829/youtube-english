const youtube_subtitles = require('./youtube_subtitles');
const openaiAPI = require('./openai_api');
const blankFillQuiz = require('./blank_fill_quizs');
// const { google } = require("googleapis");
// // const youtube = google.youtube({
// //   version: "v3",
// //   auth: apiKey,
// // });

module.exports = {
  getSearchResult: async (res, req, next) => {
    try {
      const searchQuery = req.query.search_query;
      const response = await youtube.search.list({
        part: "snippet",
        q: searchQuery,
      });

      const titles = response.data.items.map((item) => item.snippet.title);
      res.send(titles);
    } catch (err) {
      next(err);
    }
  },
  getSubtitles: async (req, res, next) => {
    console.log(req.body.videoUrl)
    try {
      const videoUrl = req.body.videoUrl;
      if (!videoUrl) {
        return res.status(400).send({ error: "videoUrl is required" });
      }
      console.log(videoUrl)
      const subtitles = await youtube_subtitles.getSubtitles(videoUrl);
      res.json(subtitles);
    } catch (err) {
      next(err);
    }
  },

  getTitle: async (req, res, next) => {
    try {
      const title = await youtube_subtitles.getTitle(req.body.videoUrl);
      console.log(title)
      res.json({title});
    }
    catch (err) {
      next(err)
    }
  },

  getQuizFromSubtitles: async (req, res, next) => {
    try {
      const subtitles = req.body.subtitles;
      const quiz_json = await openaiAPI.renderQuizSentences(subtitles)
      res.json(quiz_json);
    } catch (err) {
      next(err);
    }
  },

  getQuizFromVideo: async (req, res, next) => {
    try {
      const videoUrl = req.body.videoUrl;
      if (!videoUrl) {
        return res.status(400).send({ error: "videoUrl is required" });
      }
      const subtitles = await youtube_subtitles.getSubtitles(videoUrl);
      const subtitlesText = subtitles.map(sub => sub.text.replace('\n', ' ')).join('\n');
      const slicedText = subtitlesText.slice(0, 15000);
      const quizJson = await openaiAPI.renderQuizSentences(slicedText);
      const blankChoicesJson = await blankFillQuiz.renderQuizChoices(quizJson)
      res.json({ subtitles: subtitles, quiz: quizJson, blankChoicesJson: blankChoicesJson });
    } catch (err) {
      next(err);
    }
  }


}
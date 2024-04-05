const youtube_subtitles = require('./youtube_subtitles');
const openaiAPI = require('./openai_api');
// const { google } = require("googleapis");
// // const youtube = google.youtube({
// //   version: "v3",
// //   auth: apiKey,
// // });

module.exports = {
 getSearchResult:async (res, req, next) => {
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
  try {
      const videoUrl = req.body.videoUrl;
      if (!videoUrl) {
          return res.status(400).send({ error: "videoUrl is required" });
      }
      const subtitles = await youtube_subtitles.getSubtitles(videoUrl);
      res.json(subtitles);
  } catch (err) {
      next(err);
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
    const subtitlesText = subtitles.map(sub => sub.text.replace('\n',' ')).join('\n'); // Convert the subtitles array into a single string
    const slicedText = subtitlesText.slice(0, 15000);
    const quizJson = await openaiAPI.renderQuizSentences(slicedText); // Pass the string to the OpenAI API
    res.json({ subtitles:subtitles, quiz: quizJson });
  } catch (err) {
    next(err);
  }
}


}
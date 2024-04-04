// const { google } = require("googleapis");
// // const youtube = google.youtube({
// //   version: "v3",
// //   auth: apiKey,
// // });

const fs = require('fs');
const ytdl = require('ytdl-core');
const xml2js = require('xml2js');
const he = require('he');

async function getSubtitles(videoUrl) {
  try {
      const fetch = (await import('node-fetch')).default;
      const info = await ytdl.getInfo(videoUrl);
      const tracks = info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks;
      if (tracks && tracks.length > 0) {
          const englishTrack = tracks.find(track => track.languageCode === 'en' || track.languageCode === 'en-US');
          if (englishTrack) {
              const subtitlesUrl = englishTrack.baseUrl;
              const subtitlesXml = await fetch(subtitlesUrl).then(res => res.text());

              // Convert XML to JSON
              const parser = new xml2js.Parser();
              const subtitlesJson = await parser.parseStringPromise(subtitlesXml);
              const subtitles = subtitlesJson.transcript.text.map(textObj => ({
                  start: textObj.$.start,
                  dur: textObj.$.dur,
                  text: he.decode(textObj._)
              }));

              return subtitles;  // Return the subtitles instead of writing to a file
          } else {
              console.log('No English captions found for this video.');
          }
      } else {
          console.log('No captions available for this video.');
      }
  } catch (error) {
      console.error('Error downloading subtitles:', error);
      throw error;  // Throw the error to be handled by the caller
  }
}


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
      const subtitles = await getSubtitles(videoUrl);
      res.json(subtitles);
  } catch (err) {
      next(err);
  }
}

}
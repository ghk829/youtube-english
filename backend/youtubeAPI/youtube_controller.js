const { google } = require("googleapis");
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

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
}

}
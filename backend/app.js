const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const user_controller = require('./userManage/user_controller');
const youtube_controller = require('./youtubeAPI/youtube_controller');


app.get("/login", user_controller.decodeToken);
app.get("/user/all", user_controller.getUserInfo);
app.get("/search", youtube_controller.getSearchResult);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

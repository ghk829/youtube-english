const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const user_controller = require('./userManage/user_controller');
const youtube_controller = require('./youtubeAPI/youtube_controller');

app.use(express.json());
app.use(cors({
  origin: "https://youtube-english.onrender.com",
  headers: ["Content-Type"],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, './build')));


app.get("/login", user_controller.decodeToken);
app.get("/user/all", user_controller.getUserInfo);
app.get("/search", youtube_controller.getSearchResult);
app.post('/subtitles', youtube_controller.getSubtitles);
app.post('/quizFromSubtitle', youtube_controller.getQuizFromSubtitles);
app.post('/getQuizFromVideo', youtube_controller.getQuizFromVideo)


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const routes = require("./routes/router");


app.use("/", routes);
app.use(cors());
app.use(express.static(path.join(__dirname, './build')));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
// app.get("/test", (req, res)=>{
//   res.send("HELLO");
// });
// app.get("/login", user_controller.decodeToken);
// app.get("/user/all", user_controller.getUserInfo);
// app.get("/search", youtube_controller.getSearchResult);
// app.post('/subtitles', youtube_controller.getSubtitles);
// app.post('/quizFromSubtitle', youtube_controller.getQuizFromSubtitles);
// app.post('/getQuizFromVideo', youtube_controller.getQuizFromVideo)


app.listen(3000, () => {
  console.log(`App listening at http://localhost:3000`);
});
module.exports = app;
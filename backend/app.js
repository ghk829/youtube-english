const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
const routes = require("./routes/router");

app.use("/", routes);
app.use(cors());
app.use(express.static(path.join(__dirname, "./build")));
app.use(express.json());

app.listen(8000, () => {
  console.log(`App listening at http://localhost:8000`);
});
module.exports = app;

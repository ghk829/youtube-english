require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const routes = require("./routes/router");
const { swaggerUi, specs } = require("./modules/swagger");

app.use(cors());
app.use("/", routes);
app.use(express.static(path.join(__dirname, "./build")));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(8000, () => {
  console.log(`App listening at http://localhost:8000`);
});
module.exports = app;

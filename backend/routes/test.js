const test = require("express").Router();

test.get("/test", async function (req, res, next) {
  res.send("Something done");
});

module.exports = test;
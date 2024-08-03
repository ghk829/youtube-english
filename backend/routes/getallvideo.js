const getallvideo = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

getallvideo.get("/getallvideo", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");

      const collection = db.collection("youtube_videos");

      res.json(await collection.find().toArray());
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }

  run();
});

module.exports = getallvideo;

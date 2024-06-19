const getVideoUrl = require("express").Router();
const { MongoClient } = require('mongodb');
const mongoUri = process.env.MONGO_URL;


getVideoUrl.get("/video/all", async function (req, res, next) {

const client = new MongoClient(mongoUri, {
});

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db('english');  

        const collection = db.collection('youtube_videos');  

        const documents = await collection.find();
        res.json(documents);

    } catch (err) {
      console.error(err);
    } finally {
        await client.close();
    }
}

run();
});

module.exports = getVideoUrl;
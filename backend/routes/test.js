const test = require("express").Router();
const { MongoClient } = require('mongodb');


test.get("/test", async function (req, res, next) {

const client = new MongoClient(mongoUri, {
});

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db('english');  

        const collection = db.collection('youtube_videos');  

        const documents = await collection.find().toArray();
        console.log(documents);
        res.send("Something done");

    } catch (err) {
      res.send(err);
    } finally {
        await client.close();
    }
}

run();
});

module.exports = test;
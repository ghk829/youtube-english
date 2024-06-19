const getallvideo = require("express").Router();
const { MongoClient } = require('mongodb');
const mongoUri = "mongodb+srv://messiki:WzRGijqN7A8jG4a8@shopilotcluster.u2wmlln.mongodb.net"

getallvideo.get("/getallvideo", async function (req, res, next) {


    const client = new MongoClient(mongoUri, {
    });

    async function run() {
        try {
            await client.connect();
            console.log("Connected successfully to server");

            const db = client.db('english');

            const collection = db.collection('youtube_videos');

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
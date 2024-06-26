const adduser = require("express").Router();
const { MongoClient } = require('mongodb');
const mongoUri = process.env.MONGODB_URI

adduser.post("/adduser", async function (req, res, next) {


    const client = new MongoClient(mongoUri, {
    });

    async function run() {
        try {
            await client.connect();
            console.log("Connected successfully to server");

            const db = client.db('english');

            const collection = db.collection('users');
            console.log(req)
            await collection.updateOne({"email": req.body.user.email}, req.body.user, {upsert: True});
            res.json({message: "success!"})

        } catch (err) {
            console.log(err);
            res.errored({message: "failed!"})
        } finally {
            await client.close();
        }
    }

    run();
});

module.exports = adduser;
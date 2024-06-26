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
            console.log(req.body.user)
            await collection.updateOne({"email": req.body.user.email}, {
                $set: {name: req.body.user.name, email: req.body.user.email, picture: req.body.user.picture},

            }, {upsert: true});
            res.json({message: "success!"})

        } catch (err) {
            console.log(err);
            res.json({message: "failed!"})
        } finally {
            await client.close();
        }
    }

    run();
});

module.exports = adduser;
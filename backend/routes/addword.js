const addword = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

addword.post("/addword", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");
      const collection = db.collection("words");

      // 요청 본체에서 name, word, meaning을 추출
      const { name, word, meaning } = req.body;

      // 데이터베이스에 단어 추가
      await collection.insertOne({ name: name, word: word, meaning: meaning });
      res.json({ message: "success!" });
    } catch (err) {
      console.log(err);
      res.json({ message: "failed!" });
    } finally {
      await client.close();
    }
  }

  run();
});

module.exports = addword;

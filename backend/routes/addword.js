const express = require("express");
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

const addword = express.Router(); // express.Router()를 사용하여 라우터 생성

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어 추가
addword.use(express.json());

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
      await collection.insertOne({ name, word, meaning });
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

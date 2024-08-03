const getwords = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

getwords.get("/getwords", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");
      const collection = db.collection("words");

      // 쿼리 파라미터에서 name을 가져옵니다.
      const name = req.query.name;

      // name이 존재하면 필터링하여 가져오기
      const filter = name ? { name: name } : {}; // name이 주어지면 필터링, 아니면 전체 가져오기
      const result = await collection.find(filter).toArray();

      // 결과를 클라이언트에 반환
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      await client.close();
    }
  }

  run();
});

module.exports = getwords;

const addword = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;
/**
 * @swagger
 * /addword:
 *   post:
 *     summary: 단어 추가하기
 *     description: 저장하고자 하는 영단어와 그 의미를 데이터베이스에 추가합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - word
 *               - meaning
 *             properties:
 *               name:
 *                 type: string
 *                 description: 저장하는 유저.
 *                 example: "사용자1"
 *               word:
 *                 type: string
 *                 description: 저장하고자 하는 영단어.
 *                 example: "apple"
 *               meaning:
 *                 type: string
 *                 description: 저장하고자 하는 영단어의 의미.
 *                 example: "사과"
 *     responses:
 *       200:
 *         description: Word added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "success!"
 *       500:
 *         description: Failed to add the word.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "failed!"
 */

addword.post("/addword", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");
      const collection = db.collection("words");

      if (!req.body) {
        return res.status(400).json({ message: "요청 본문이 필요합니다." });
      }
      // 요청 본체에서 name, word, meaning을 추출
      const { name, word, meaning, sentence, translation } = req.body;

      // 데이터베이스에 단어 추가
      await collection.insertOne({
        name,
        word,
        meaning,
        sentence,
        translation,
        studied: 0,
      });
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

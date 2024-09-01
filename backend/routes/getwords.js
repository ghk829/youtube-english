const getwords = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

/**
 * @swagger
 * /getwords:
 *   get:
 *     summary: 단어 조회
 *     description: 쿼리 파라미터를 사용하여 단어를 조회합니다. name 파라미터가 제공되면 해당 단어만 반환하고, 제공되지 않으면 모든 단어를 반환합니다.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: 조회할 단어의 이름
 *         schema:
 *           type: string
 *           example: "example"
 *     responses:
 *       200:
 *         description: 성공적으로 단어 정보를 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: 단어 ID
 *                   name:
 *                     type: string
 *                     description: 단어 이름
 *                   definition:
 *                     type: string
 *                     description: 단어의 정의
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

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
      const studied = req.query.studied;

      let filter = {};
      // name이 존재하면 필터링하여 가져오기
      if (name) {
        filter.name = name; // name이 주어지면 필터링
      }
      if (studied) {
        filter.studied = parseInt(studied, 10); // studied가 주어지면 필터링 (정수로 변환)
      }
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

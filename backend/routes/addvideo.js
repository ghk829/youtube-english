const addvideo = require("express").Router();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const mongoUri =
  "mongodb+srv://messiki:WzRGijqN7A8jG4a8@shopilotcluster.u2wmlln.mongodb.net";

/**
 * @swagger
 * /addvideo:
 *   post:
 *     summary: 비디오 추가
 *     description: 새로운 비디오 정보를 데이터베이스에 추가합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newVideo:
 *                 type: object
 *                 required:
 *                   - title
 *                   - description
 *                   - url
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: 비디오 제목
 *                     example: "비디오 제목 예시"
 *                   description:
 *                     type: string
 *                     description: 비디오 설명
 *                     example: "비디오 설명 예시"
 *                   url:
 *                     type: string
 *                     description: 비디오 URL
 *                     example: "https://www.youtube.com/watch?v=example"
 *     responses:
 *       200:
 *         description: 비디오가 성공적으로 추가됨
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: 비디오 ID
 *                   title:
 *                     type: string
 *                     description: 비디오 제목
 *                   description:
 *                     type: string
 *                     description: 비디오 설명
 *                   url:
 *                     type: string
 *                     description: 비디오 URL
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

addvideo.post("/addvideo", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");

      const collection = db.collection("youtube_videos");
      console.log(req);
      await collection.insertOne({ _id: new ObjectId(), ...req.body.newVideo });

      res.json(await collection.find().toArray());
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }

  run();
});

module.exports = addvideo;

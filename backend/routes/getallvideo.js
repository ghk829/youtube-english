const getallvideo = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

/**
 * @swagger
 * /getallvideo:
 *   get:
 *     summary: 모든 비디오 조회
 *     description: 데이터베이스에 저장된 모든 비디오 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 모든 비디오 정보를 반환합니다.
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

getallvideo.get("/getallvideo", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");

      const collection = db.collection("youtube_videos");

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

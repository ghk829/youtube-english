const getvideo = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

/**
 * @swagger
 * /getvideo:
 *   get:
 *     summary: 카테고리별 비디오 가져오기
 *     description: 카테고리와 서브카테고이에 따라 필터링
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         description: 메인 카테고리
 *         schema:
 *           type: string
 *       - in: query
 *         name: subcategory
 *         required: false
 *         description: 서브 카테고리
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: 제목
 *                   url:
 *                     type: string
 *                     description: 링크
 *                   category:
 *                     type: string
 *                     description: 카테고리
 *       500:
 *         description: Internal Server Error
 */

getvideo.get("/getvideo", async function (req, res, next) {
  const { category, subcategory } = req.query; // 쿼리 파라미터 추출
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server::getvideo");

      const db = client.db("english");
      const collection = db.collection("youtube_videos");

      // 카테고리와 서브카테고리에 따라 필터링
      const query = {};
      if (category) {
        query.category = category;
      }
      if (subcategory) {
        query.subcategory = subcategory;
      }

      const videos = await collection.find(query).toArray();
      res.json(videos);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } finally {
      await client.close();
    }
  }

  run();
});

module.exports = getvideo;

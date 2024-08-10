const adduser = require("express").Router();
const { MongoClient } = require("mongodb");
const mongoUri = process.env.MONGODB_URI;

/**
 * @swagger
 * /adduser:
 *   post:
 *     summary: 사용자 추가
 *     description: 이메일을 기반으로 사용자를 추가하거나 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - picture
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: 사용자 이름
 *                     example: "홍길동"
 *                   email:
 *                     type: string
 *                     description: 사용자 이메일
 *                     example: "example@example.com"
 *                   picture:
 *                     type: string
 *                     description: 사용자 프로필 사진 URL
 *                     example: "http://example.com/picture.jpg"
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 추가
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success!"
 *       500:
 *         description: 사용자 추가 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "failed!"
 */

adduser.post("/adduser", async function (req, res, next) {
  const client = new MongoClient(mongoUri, {});

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");

      const db = client.db("english");

      const collection = db.collection("users");
      await collection.updateOne(
        { email: req.body.user.email },
        {
          $set: {
            name: req.body.user.name,
            email: req.body.user.email,
            picture: req.body.user.picture,
          },
        },
        { upsert: true }
      );
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

module.exports = adduser;

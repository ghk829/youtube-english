const axios = require('axios');
const kakao = require("express").Router();

kakao.post('/kakao', async (req, res) => {
  try {
    const { code } = req.query;
    const response = await axios.post('https://kauth.kakao.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.REST_API_KAKAO,
      redirect_uri: process.env.REDIRECT_URI,
      code,
    });
    const { access_token } = response.data;

    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(userResponse.data)
    const userData = userResponse.data;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = kakao;
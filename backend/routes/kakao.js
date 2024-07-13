const axios = require('axios');
const kakao = require("express").Router();
const qs = require('qs');
const jwt = require('jsonwebtoken');


kakao.post('/kakao', async (req, res) => {

  
  try {
    const { code } = req.query;
    const response = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
      grant_type: 'authorization_code',
      client_id: "1a3778c4bb5ad25950d797f5049ca8a5",
      redirect_uri: "https://youtube-english-nine.vercel.app/oauth",
      code: code,
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const { access_token } = response.data;

    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userData = {
      name: userResponse.data.properties.nickname,
      emai: "kakao",
      picture: userResponse.data.properties.profile_image,

    };


    if(userData){

      const addUser = async (user) => {
          await axios.post(`${process.env.REACT_APP_MOD || ""}/api/adduser`, { user: user });
      }

      let userInfo = {
          name: userData.name,
          email: userData.email,
          picture: userData.picture
      }

      addUser(userInfo);
  }
    res.json(userData);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = kakao;

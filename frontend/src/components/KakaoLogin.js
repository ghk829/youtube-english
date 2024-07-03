import React, { useState } from 'react';
import kakaoLogin from '../img/kakao_login.png';

import { useNavigate } from "react-router-dom";

const KakaoLogin = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const goToMain = () => {
      navigate("/");
  };

  const handleLogin = async () => {
    try {
      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KAKAO}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI }&response_type=code`;
      window.location.href = kakaoURL;
    } catch (err) {
      setError(err);
    }
  };

  return (
    <img
      src={kakaoLogin}
      alt="kakao-login"
      onClick={handleLogin}
      className="kakao-login-btn"
    />
  );
};

export default KakaoLogin;
